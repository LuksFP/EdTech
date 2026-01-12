import React from 'react';
import { Course, Enrollment } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Star, Users, Calendar, DollarSign } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  enrollment?: Enrollment;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
  onMarkComplete?: (enrollmentId: string) => void;
  isAdmin?: boolean;
}

const categoryLabels: Record<string, string> = {
  'programming': 'Programação',
  'design': 'Design',
  'business': 'Negócios',
  'marketing': 'Marketing',
  'data-science': 'Data Science'
};

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  enrollment,
  isOpen,
  onClose,
  onEnroll,
  onMarkComplete,
  isAdmin
}) => {
  if (!course) return null;

  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'completed';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-display">{course.title}</DialogTitle>
              <DialogDescription className="text-base">
                por {course.instructor}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {categoryLabels[course.category]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">{course.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <span className="font-semibold">{course.duration}</span>
              <span className="text-xs text-muted-foreground">Duração</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <BookOpen className="w-5 h-5 text-primary mb-2" />
              <span className="font-semibold">{course.lessons}</span>
              <span className="text-xs text-muted-foreground">Aulas</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Star className="w-5 h-5 text-warning mb-2" />
              <span className="font-semibold">{course.rating || '-'}</span>
              <span className="text-xs text-muted-foreground">Avaliação</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Users className="w-5 h-5 text-primary mb-2" />
              <span className="font-semibold">{course.studentsCount.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Alunos</span>
            </div>
          </div>

          {enrollment && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Seu Progresso</span>
                <span className="text-primary font-semibold">{enrollment.progress}%</span>
              </div>
              <Progress value={enrollment.progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Matriculado em: {new Date(enrollment.enrolledAt).toLocaleDateString('pt-BR')}</span>
                {enrollment.completedAt && (
                  <span>Concluído em: {new Date(enrollment.completedAt).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  R$ {course.price.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3">
                {!isEnrolled && onEnroll && (
                  <Button size="lg" onClick={() => onEnroll(course.id)}>
                    Matricular-se Agora
                  </Button>
                )}
                {isEnrolled && !isCompleted && onMarkComplete && (
                  <Button size="lg" onClick={() => onMarkComplete(enrollment!.id)}>
                    Marcar como Concluído
                  </Button>
                )}
                {isCompleted && (
                  <Badge className="bg-success text-success-foreground text-base px-4 py-2">
                    ✓ Curso Concluído
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
