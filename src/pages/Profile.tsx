import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CourseContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AvatarUpload } from '@/components/AvatarUpload';
import { downloadCertificate } from '@/lib/certificate';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Download
} from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
});

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const { enrollments, courses, isLoading } = useCourses();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const completedEnrollments = enrollments.filter(e => e.userId === user?.id && e.status === 'completed');

  const userEnrollments = enrollments.filter(e => e.userId === user?.id);
  const completedCourses = userEnrollments.filter(e => e.status === 'completed').length;
  const activeCourses = userEnrollments.filter(e => e.status === 'active').length;
  const overallProgress = userEnrollments.length > 0
    ? Math.round(userEnrollments.reduce((acc, e) => acc + e.progress, 0) / userEnrollments.length)
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = (newUrl: string) => {
    refreshUser();
  };

  const handleDownloadCertificate = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === user?.id);
    
    if (course && enrollment && user) {
      downloadCertificate(course, enrollment, user.name);
    }
  };

  const handleSave = async () => {
    try {
      const validated = profileSchema.parse(formData);
      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          name: validated.name,
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshUser();
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível atualizar o perfil",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-4 max-w-4xl animate-fade-in">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <AvatarUpload
                userId={user.id}
                currentAvatar={user.avatar}
                userName={user.name}
                onAvatarChange={handleAvatarChange}
                disabled={false}
              />
              <CardTitle className="font-display mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge variant="outline" className="mt-2 capitalize">
                {user.role === 'admin' ? 'Administrador' : 'Aluno'}
              </Badge>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {user.createdAt || 'recente'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>
                      Gerencie suas informações de perfil
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Seu nome"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats for Students */}
            {user.role === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Seu Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-lg bg-primary/10">
                          <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold text-primary">{activeCourses}</p>
                          <p className="text-xs text-muted-foreground">Em Andamento</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-success/10">
                          <Award className="w-6 h-6 mx-auto mb-2 text-success" />
                          <p className="text-2xl font-bold text-success">{completedCourses}</p>
                          <p className="text-xs text-muted-foreground">Concluídos</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-warning/10">
                          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-warning" />
                          <p className="text-2xl font-bold text-warning">{overallProgress}%</p>
                          <p className="text-xs text-muted-foreground">Progresso Geral</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso Total</span>
                          <span className="font-medium">{overallProgress}%</span>
                        </div>
                        <Progress value={overallProgress} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Certificates Section */}
            {user.role === 'student' && completedEnrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Seus Certificados
                  </CardTitle>
                  <CardDescription>
                    Baixe os certificados dos cursos que você concluiu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedEnrollments.map(enrollment => {
                      const course = courses.find(c => c.id === enrollment.courseId);
                      if (!course) return null;
                      return (
                        <div 
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                              <Award className="w-5 h-5 text-success" />
                            </div>
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Concluído em {enrollment.completedAt || 'recente'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCertificate(course.id)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Baixar PDF
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
