import React from 'react';
import { CourseFilters as CourseFiltersType, CourseCategory, CourseStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface CourseFiltersProps {
  filters: CourseFiltersType;
  onFiltersChange: (filters: CourseFiltersType) => void;
  showStatusFilter?: boolean;
}

const categories: { value: CourseCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas Categorias' },
  { value: 'programming', label: 'Programação' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Negócios' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data-science', label: 'Data Science' }
];

const statuses: { value: CourseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos Status' },
  { value: 'published', label: 'Publicado' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'archived', label: 'Arquivado' }
];

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFiltersChange,
  showStatusFilter = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.category || 'all'}
        onValueChange={(value) => onFiltersChange({ ...filters, category: value as CourseCategory | 'all' })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showStatusFilter && (
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as CourseStatus | 'all' })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
