import { User, Course, Enrollment } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@edtech.com',
    name: 'Maria Silva',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'aluno@edtech.com',
    name: 'João Santos',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Avançado: Hooks, Context e Performance',
    description: 'Domine os conceitos avançados do React e construa aplicações escaláveis e performáticas.',
    category: 'programming',
    instructor: 'Carlos Mendes',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    duration: '24h',
    lessons: 48,
    status: 'published',
    price: 199.90,
    rating: 4.8,
    studentsCount: 1250,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'UX/UI Design: Do Zero ao Profissional',
    description: 'Aprenda a criar interfaces incríveis e experiências de usuário memoráveis.',
    category: 'design',
    instructor: 'Ana Costa',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    duration: '32h',
    lessons: 64,
    status: 'published',
    price: 249.90,
    rating: 4.9,
    studentsCount: 890,
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    title: 'Python para Data Science',
    description: 'Análise de dados, visualização e machine learning com Python.',
    category: 'data-science',
    instructor: 'Roberto Lima',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    duration: '40h',
    lessons: 80,
    status: 'published',
    price: 299.90,
    rating: 4.7,
    studentsCount: 2100,
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'Marketing Digital Estratégico',
    description: 'Estratégias avançadas de marketing para crescimento exponencial.',
    category: 'marketing',
    instructor: 'Fernanda Alves',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    duration: '20h',
    lessons: 40,
    status: 'published',
    price: 179.90,
    rating: 4.6,
    studentsCount: 750,
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    title: 'TypeScript Masterclass',
    description: 'Tipagem avançada e padrões de projeto com TypeScript.',
    category: 'programming',
    instructor: 'Carlos Mendes',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
    duration: '18h',
    lessons: 36,
    status: 'draft',
    price: 149.90,
    rating: 0,
    studentsCount: 0,
    createdAt: '2024-02-15'
  },
  {
    id: '6',
    title: 'Empreendedorismo Digital',
    description: 'Como criar e escalar seu negócio online do zero.',
    category: 'business',
    instructor: 'Paulo Henrique',
    thumbnail: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=250&fit=crop',
    duration: '28h',
    lessons: 56,
    status: 'archived',
    price: 229.90,
    rating: 4.5,
    studentsCount: 450,
    createdAt: '2023-11-01'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    courseId: '1',
    userId: '2',
    status: 'active',
    progress: 65,
    enrolledAt: '2024-01-20'
  },
  {
    id: '2',
    courseId: '2',
    userId: '2',
    status: 'completed',
    progress: 100,
    enrolledAt: '2024-01-10',
    completedAt: '2024-02-15'
  },
  {
    id: '3',
    courseId: '3',
    userId: '2',
    status: 'active',
    progress: 30,
    enrolledAt: '2024-02-01'
  }
];

export const mockStudents: User[] = [
  {
    id: '2',
    email: 'joao@email.com',
    name: 'João Santos',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    id: '3',
    email: 'maria@email.com',
    name: 'Maria Oliveira',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  {
    id: '4',
    email: 'pedro@email.com',
    name: 'Pedro Costa',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
  {
    id: '5',
    email: 'ana@email.com',
    name: 'Ana Beatriz',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
  }
];
