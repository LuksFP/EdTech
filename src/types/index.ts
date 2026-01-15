// User types
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Course types
export type CourseStatus = 'published' | 'draft' | 'archived';
export type CourseCategory = 'programming' | 'design' | 'business' | 'marketing' | 'data-science';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  instructor: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  status: CourseStatus;
  price: number;
  rating: number;
  studentsCount: number;
  createdAt: string;
}

// Enrollment types
export type EnrollmentStatus = 'active' | 'completed' | 'paused';

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface EnrollmentWithCourse {
  id: string;
  course_id: string;
  status: string;
  progress: number;
  course_title?: string;
}

// Review types
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Filter types
export interface CourseFilters {
  category?: CourseCategory | 'all';
  status?: CourseStatus | 'all';
  search?: string;
}

// Analytics types
export interface AnalyticsData {
  date: string;
  students: number;
  revenue: number;
  enrollments: number;
}

export interface CategoryStats {
  category: string;
  courses: number;
  students: number;
  revenue: number;
}
