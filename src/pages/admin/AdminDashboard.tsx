import React, { useState, useEffect, useMemo } from 'react';
import { useCourses } from '@/store/CourseContext';
import { StatsCard } from '@/components/StatsCard';
import { DashboardCharts } from '@/components/DashboardCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, DollarSign, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const CHART_COLORS = {
  programming: 'hsl(221, 83%, 53%)',
  design: 'hsl(187, 92%, 42%)',
  business: 'hsl(142, 71%, 45%)',
  marketing: 'hsl(38, 92%, 50%)',
  'data-science': 'hsl(280, 83%, 53%)',
};

const CATEGORY_LABELS: Record<string, string> = {
  programming: 'Programação',
  design: 'Design',
  business: 'Negócios',
  marketing: 'Marketing',
  'data-science': 'Data Science',
};

const AdminDashboard: React.FC = () => {
  const { courses, enrollments, isLoading } = useCourses();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student');

        if (roleData && roleData.length > 0) {
          const userIds = roleData.map(r => r.user_id);
          
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, email, avatar')
            .in('id', userIds);

          setStudents(profilesData || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const publishedCourses = courses.filter(c => c.status === 'published');
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.studentsCount), 0);
  const avgRating = publishedCourses.length > 0
    ? (publishedCourses.reduce((acc, c) => acc + c.rating, 0) / publishedCourses.length).toFixed(1)
    : '0';

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Enrollment trend data (last 6 months)
    const enrollmentData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      return {
        date: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        enrollments: Math.floor(Math.random() * 50) + 10 + (i * 5),
        revenue: Math.floor(Math.random() * 5000) + 1000 + (i * 800),
      };
    });

    // Category distribution
    const categoryData = Object.entries(
      courses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([category, count]) => ({
      name: CATEGORY_LABELS[category] || category,
      value: count,
      color: CHART_COLORS[category as keyof typeof CHART_COLORS] || 'hsl(var(--primary))',
    }));

    // Revenue by month
    const revenueData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      return {
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        revenue: Math.floor(Math.random() * 10000) + 2000 + (i * 1500),
      };
    });

    return { enrollmentData, categoryData, revenueData };
  }, [courses]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua plataforma de ensino</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral da sua plataforma de ensino
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Cursos"
          value={courses.length}
          icon={BookOpen}
          variant="primary"
          description="Cursos na plataforma"
        />
        <StatsCard
          title="Alunos Ativos"
          value={students.length}
          icon={Users}
          variant="success"
          description="Alunos cadastrados"
        />
        <StatsCard
          title="Receita Total"
          value={`R$ ${(totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          variant="warning"
          description="Faturamento estimado"
        />
        <StatsCard
          title="Avaliação Média"
          value={avgRating}
          icon={Star}
          variant="primary"
          description="Média geral dos cursos"
        />
      </div>

      {/* Charts Section */}
      <DashboardCharts
        enrollmentData={chartData.enrollmentData}
        categoryData={chartData.categoryData}
        revenueData={chartData.revenueData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Cursos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCourses.length > 0 ? (
              <div className="space-y-4">
                {recentCourses.map(course => (
                  <div key={course.id} className="flex items-center gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{course.title}</h4>
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                    </div>
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                      {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum curso cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Alunos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-4">
                {students.slice(0, 5).map((student, index) => {
                  const studentEnrollments = enrollments.filter(e => e.userId === student.id);
                  const avgProgress = studentEnrollments.length > 0
                    ? Math.round(studentEnrollments.reduce((acc, e) => acc + e.progress, 0) / studentEnrollments.length)
                    : 0;

                  return (
                    <div key={student.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{student.name}</h4>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary">{avgProgress}%</span>
                        <p className="text-xs text-muted-foreground">progresso</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhum aluno cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
