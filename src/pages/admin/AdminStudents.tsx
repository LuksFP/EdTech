import React from 'react';
import { mockStudents, mockEnrollments, mockCourses } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Search, Mail, BookOpen } from 'lucide-react';

const AdminStudents: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const studentEnrollments = mockEnrollments.filter(e => e.userId === studentId);
    const completed = studentEnrollments.filter(e => e.status === 'completed').length;
    const inProgress = studentEnrollments.filter(e => e.status === 'active').length;
    const avgProgress = studentEnrollments.length > 0
      ? Math.round(studentEnrollments.reduce((acc, e) => acc + e.progress, 0) / studentEnrollments.length)
      : 0;
    
    return { total: studentEnrollments.length, completed, inProgress, avgProgress };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Alunos
        </h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe o progresso dos alunos
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map(student => {
          const stats = getStudentStats(student.id);
          const studentEnrollments = mockEnrollments.filter(e => e.userId === student.id);

          return (
            <Card key={student.id} className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg font-display">{student.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="secondary">
                        {stats.total} cursos
                      </Badge>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {stats.completed} concluídos
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso Geral</span>
                    <span className="font-medium">{stats.avgProgress}%</span>
                  </div>
                  <Progress value={stats.avgProgress} className="h-2" />

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Cursos Matriculados
                    </h4>
                    <div className="space-y-2">
                      {studentEnrollments.slice(0, 3).map(enrollment => {
                        const course = mockCourses.find(c => c.id === enrollment.courseId);
                        if (!course) return null;
                        
                        return (
                          <div key={enrollment.id} className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1 mr-2">{course.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{enrollment.progress}%</span>
                              {enrollment.status === 'completed' && (
                                <Badge variant="secondary" className="text-xs">✓</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Nenhum aluno encontrado com o termo de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
