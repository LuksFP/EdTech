import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/store/CourseContext';
import { useAuth } from '@/store/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewForm } from '@/components/ReviewForm';
import { useToast } from '@/hooks/use-toast';
import { downloadCertificate } from '@/lib/certificate';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  CheckCircle2,
  PlayCircle,
  Award,
  Download
} from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    getCourseById, 
    getEnrollmentByCourseId, 
    getReviewsByCourseId,
    enrollInCourse,
    markCourseComplete,
    addReview,
    markReviewHelpful,
    isLoading 
  } = useCourses();

  const course = getCourseById(id || '');
  const enrollment = user ? getEnrollmentByCourseId(id || '', user.id) : undefined;
  const reviews = getReviewsByCourseId(id || '');
  const hasReviewed = reviews.some(r => r.userId === user?.id);

  // Módulos simulados para demonstração
  const modules = [
    { id: 1, title: 'Introdução ao Curso', lessons: 3, duration: '45min', completed: enrollment ? enrollment.progress >= 20 : false },
    { id: 2, title: 'Fundamentos Básicos', lessons: 5, duration: '1h 30min', completed: enrollment ? enrollment.progress >= 40 : false },
    { id: 3, title: 'Conceitos Intermediários', lessons: 4, duration: '1h 15min', completed: enrollment ? enrollment.progress >= 60 : false },
    { id: 4, title: 'Práticas Avançadas', lessons: 6, duration: '2h', completed: enrollment ? enrollment.progress >= 80 : false },
    { id: 5, title: 'Projeto Final', lessons: 2, duration: '1h', completed: enrollment ? enrollment.progress >= 100 : false },
  ];

  const handleEnroll = async () => {
    if (!user || !course) return;
    try {
      await enrollInCourse(course.id, user.id);
      toast({
        title: "Matrícula realizada!",
        description: `Você foi matriculado em ${course.title}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível realizar a matrícula",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    if (!enrollment) return;
    try {
      await markCourseComplete(enrollment.id);
      toast({
        title: "Parabéns!",
        description: "Você concluiu o curso com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como concluído",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCertificate = () => {
    if (course && enrollment && user) {
      downloadCertificate(course, enrollment, user.name);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!user || !course) return;
    try {
      await addReview({
        courseId: course.id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating,
        comment,
      });
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo seu feedback",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar a avaliação",
        variant: "destructive",
      });
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'programming': 'Programação',
      'design': 'Design',
      'business': 'Negócios',
      'marketing': 'Marketing',
      'data-science': 'Data Science'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-4 animate-fade-in">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-xl"
              />
              <Badge className="absolute top-4 left-4">
                {getCategoryLabel(course.category)}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {course.title}
              </h1>
              <p className="text-muted-foreground mb-4">
                Por <span className="text-foreground font-medium">{course.instructor}</span>
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} aulas</span>
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount} alunos</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description || 'Este curso oferece uma experiência completa de aprendizado, cobrindo desde os fundamentos até técnicas avançadas. Você terá acesso a aulas práticas, exercícios e projetos que ajudarão a consolidar seu conhecimento na área.'}
                </p>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Módulos do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      module.completed ? 'bg-success/10 border-success/30' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      module.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {module.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons} aulas • {module.duration}
                      </p>
                    </div>
                    {enrollment && (
                      <PlayCircle className={`w-5 h-5 ${module.completed ? 'text-success' : 'text-primary'}`} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avaliações ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Review Form */}
                {enrollment && !hasReviewed && (
                  <div className="mb-6">
                    <ReviewForm 
                      courseId={course.id}
                      onSubmit={({ rating, comment }) => handleReviewSubmit(rating, comment)} 
                    />
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <ReviewCard 
                        key={review.id} 
                        review={review}
                        onHelpful={handleMarkHelpful}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {course.price === 0 ? (
                      'Gratuito'
                    ) : (
                      `R$ ${course.price.toFixed(2)}`
                    )}
                  </div>

                  {enrollment ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                      
                      {enrollment.status === 'completed' ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-2 text-success py-4">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Curso Concluído!</span>
                          </div>
                          <Button 
                            className="w-full gap-2"
                            onClick={handleDownloadCertificate}
                          >
                            <Download className="w-4 h-4" />
                            Baixar Certificado
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button className="w-full gap-2">
                            <PlayCircle className="w-4 h-4" />
                            Continuar Curso
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={handleComplete}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Marcar como Concluído
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnroll}
                    >
                      Matricular-se Agora
                    </Button>
                  )}

                  <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Duração total</span>
                      <span className="text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de aulas</span>
                      <span className="text-foreground">{course.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificado</span>
                      <span className="text-foreground">Sim</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Acesso</span>
                      <span className="text-foreground">Vitalício</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
