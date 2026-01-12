import React, { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CourseContext';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { CourseCard } from '@/components/CourseCard';
import { CourseFilters } from '@/components/CourseFilters';
import { CourseModal } from '@/components/CourseModal';
import { Course, CourseFilters as CourseFiltersType } from '@/types';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    courses, 
    enrollments, 
    getEnrolledCourses, 
    getEnrollmentByCourseId,
    enrollInCourse,
    markCourseComplete,
    filters,
    setFilters,
    getFilteredCourses
  } = useCourses();
  const { toast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  const enrolledCourses = getEnrolledCourses(user.id);
  const completedCourses = enrollments.filter(e => e.userId === user.id && e.status === 'completed');
  const activeCourses = enrollments.filter(e => e.userId === user.id && e.status === 'active');
  const totalProgress = activeCourses.length > 0
    ? Math.round(activeCourses.reduce((acc, e) => acc + e.progress, 0) / activeCourses.length)
    : 0;

  const availableCourses = getFilteredCourses().filter(
    c => c.status === 'published' && !enrolledCourses.some(ec => ec.id === c.id)
  );

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId, user.id);
    setIsModalOpen(false);
    toast({
      title: "Matrícula realizada!",
      description: "Você foi matriculado no curso com sucesso.",
    });
  };

  const handleMarkComplete = (enrollmentId: string) => {
    markCourseComplete(enrollmentId);
    setIsModalOpen(false);
    toast({
      title: "Parabéns!",
      description: "Você concluiu o curso com sucesso! 🎉",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue sua jornada de aprendizado. Você está indo muito bem!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Cursos Matriculados"
            value={enrolledCourses.length}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Cursos Concluídos"
            value={completedCourses.length}
            icon={Award}
            variant="success"
          />
          <StatsCard
            title="Em Progresso"
            value={activeCourses.length}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Progresso Médio"
            value={`${totalProgress}%`}
            icon={TrendingUp}
            variant="primary"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="enrolled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="enrolled">Meus Cursos</TabsTrigger>
            <TabsTrigger value="available">Explorar Cursos</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={getEnrollmentByCourseId(course.id, user.id)}
                    onViewDetails={handleViewDetails}
                    onMarkComplete={handleMarkComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum curso matriculado</h3>
                <p className="text-muted-foreground">
                  Explore nossa biblioteca de cursos e comece a aprender!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <CourseFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={handleViewDetails}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>

            {availableCourses.length === 0 && (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Nenhum curso encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <CourseModal
        course={selectedCourse}
        enrollment={selectedCourse ? getEnrollmentByCourseId(selectedCourse.id, user.id) : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEnroll={handleEnroll}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
};

export default StudentDashboard;
