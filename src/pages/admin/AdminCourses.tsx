import React, { useState } from 'react';
import { useCourses } from '@/store/CourseContext';
import { CourseCard } from '@/components/CourseCard';
import { CourseFilters } from '@/components/CourseFilters';
import { CourseModal } from '@/components/CourseModal';
import { CourseForm } from '@/components/CourseForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Course, CourseStatus } from '@/types';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminCourses: React.FC = () => {
  const { 
    getFilteredCourses, 
    filters, 
    setFilters,
    addCourse,
    updateCourse,
    updateCourseStatus,
    deleteCourse,
    isLoading
  } = useCourses();
  const { toast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredCourses = getFilteredCourses();

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleNewCourse = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleSaveCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => {
    setIsSaving(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        toast({
          title: "Curso atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        await addCourse(courseData);
        toast({
          title: "Curso criado!",
          description: "O novo curso foi adicionado à plataforma.",
        });
      }
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o curso.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (courseId: string, status: CourseStatus) => {
    try {
      await updateCourseStatus(courseId, status);
      toast({
        title: "Status atualizado!",
        description: `O curso foi ${status === 'published' ? 'publicado' : status === 'archived' ? 'arquivado' : 'salvo como rascunho'}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.message || "Não foi possível atualizar o status.",
      });
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast({
        title: "Curso excluído!",
        description: "O curso foi removido da plataforma.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o curso.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Gerenciar Cursos</h1>
            <p className="text-muted-foreground">Crie, edite e gerencie os cursos da plataforma</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Gerenciar Cursos
          </h1>
          <p className="text-muted-foreground">
            Crie, edite e gerencie os cursos da plataforma
          </p>
        </div>
        <Button onClick={handleNewCourse} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Curso
        </Button>
      </div>

      <CourseFilters 
        filters={filters}
        onFiltersChange={setFilters}
        showStatusFilter
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onViewDetails={handleViewDetails}
            showAdminActions
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Nenhum curso encontrado. Clique em "Novo Curso" para criar o primeiro!
          </p>
        </div>
      )}

      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin
      />

      <CourseForm
        course={editingCourse}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCourse}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AdminCourses;
