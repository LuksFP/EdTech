import React, { useState, useEffect } from 'react';
import { Course, CourseCategory, CourseStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CourseFormProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => void;
  isSaving?: boolean;
}

const categories: { value: CourseCategory; label: string }[] = [
  { value: 'programming', label: 'Programação' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Negócios' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data-science', label: 'Data Science' }
];

const statuses: { value: CourseStatus; label: string }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Arquivado' }
];

export const CourseForm: React.FC<CourseFormProps> = ({
  course,
  isOpen,
  onClose,
  onSave,
  isSaving
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'programming' as CourseCategory,
    instructor: '',
    thumbnail: '',
    duration: '',
    lessons: 0,
    status: 'draft' as CourseStatus,
    price: 0
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        duration: course.duration,
        lessons: course.lessons,
        status: course.status,
        price: course.price
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'programming',
        instructor: '',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
        duration: '',
        lessons: 0,
        status: 'draft',
        price: 0
      });
    }
  }, [course, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {course ? 'Editar Curso' : 'Novo Curso'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nome do curso"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o curso..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as CourseCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as CourseStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instrutor</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Nome do instrutor"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 24h"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessons">Aulas</Label>
              <Input
                id="lessons"
                type="number"
                value={formData.lessons}
                onChange={(e) => setFormData({ ...formData, lessons: Number(e.target.value) })}
                min={0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min={0}
                step={0.01}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL da Imagem</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {course ? 'Salvar Alterações' : 'Criar Curso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
