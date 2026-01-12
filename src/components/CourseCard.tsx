import React from 'react';
import { Course, Enrollment } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Star, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  onViewDetails: (course: Course) => void;
  onEnroll?: (courseId: string) => void;
  onMarkComplete?: (enrollmentId: string) => void;
  showAdminActions?: boolean;
  onEdit?: (course: Course) => void;
  onStatusChange?: (courseId: string, status: 'published' | 'draft' | 'archived') => void;
}

const categoryLabels: Record<string, string> = {
  'programming': 'Programação',
  'design': 'Design',
  'business': 'Negócios',
  'marketing': 'Marketing',
  'data-science': 'Data Science'
};

const statusStyles: Record<string, string> = {
  'published': 'bg-success/10 text-success border-success/20',
  'draft': 'bg-warning/10 text-warning border-warning/20',
  'archived': 'bg-muted text-muted-foreground border-muted'
};

const statusLabels: Record<string, string> = {
  'published': 'Publicado',
  'draft': 'Rascunho',
  'archived': 'Arquivado'
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollment,
  onViewDetails,
  onEnroll,
  onMarkComplete,
  showAdminActions,
  onEdit,
  onStatusChange
}) => {
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'completed';

  return (
    <Card className="group overflow-hidden card-hover bg-card border-border/50">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs font-medium">
            {categoryLabels[course.category]}
          </Badge>
          {showAdminActions && (
            <Badge className={`text-xs font-medium ${statusStyles[course.status]}`}>
              {statusLabels[course.status]}
            </Badge>
          )}
        </div>

        {isCompleted && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              Concluído ✓
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} aulas</span>
          </div>
        </div>

        {enrollment && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
        )}

        {!showAdminActions && course.rating > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-medium text-sm">{course.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({course.studentsCount.toLocaleString()} alunos)
              </span>
            </div>
            <span className="font-bold text-primary">
              R$ {course.price.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(course)}
          >
            Ver Detalhes
          </Button>
          
          {showAdminActions ? (
            <>
              <Button
                variant="secondary"
                onClick={() => onEdit?.(course)}
              >
                Editar
              </Button>
            </>
          ) : (
            <>
              {!isEnrolled && onEnroll && (
                <Button 
                  className="flex-1"
                  onClick={() => onEnroll(course.id)}
                >
                  Matricular
                </Button>
              )}
              {isEnrolled && !isCompleted && onMarkComplete && (
                <Button 
                  variant="default"
                  className="flex-1"
                  onClick={() => onMarkComplete(enrollment!.id)}
                >
                  Concluir
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
