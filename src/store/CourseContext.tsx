import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Course, Enrollment, CourseFilters, CourseStatus, Review, CourseCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  reviews: Review[];
  filters: CourseFilters;
  isLoading: boolean;
  setFilters: (filters: CourseFilters) => void;
  getFilteredCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getEnrolledCourses: (userId: string) => Course[];
  getEnrollmentByCourseId: (courseId: string, userId: string) => Enrollment | undefined;
  getReviewsByCourseId: (courseId: string) => Review[];
  getCourseAverageRating: (courseId: string) => number;
  enrollInCourse: (courseId: string, userId: string) => Promise<void>;
  updateEnrollmentProgress: (enrollmentId: string, progress: number) => Promise<void>;
  markCourseComplete: (enrollmentId: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  updateCourseStatus: (id: string, status: CourseStatus) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => Promise<void>;
  markReviewHelpful: (reviewId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Helper to map database course to frontend Course type
const mapDbCourse = (dbCourse: any): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  description: dbCourse.description || '',
  category: dbCourse.category as CourseCategory,
  instructor: dbCourse.instructor,
  thumbnail: dbCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
  duration: dbCourse.duration,
  lessons: dbCourse.lessons,
  status: dbCourse.status as CourseStatus,
  price: Number(dbCourse.price),
  rating: Number(dbCourse.rating),
  studentsCount: dbCourse.students_count,
  createdAt: dbCourse.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
});

// Helper to map database enrollment to frontend Enrollment type
const mapDbEnrollment = (dbEnrollment: any): Enrollment => ({
  id: dbEnrollment.id,
  courseId: dbEnrollment.course_id,
  userId: dbEnrollment.user_id,
  status: dbEnrollment.status,
  progress: dbEnrollment.progress,
  enrolledAt: dbEnrollment.enrolled_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  completedAt: dbEnrollment.completed_at?.split('T')[0]
});

// Helper to map database review to frontend Review type
const mapDbReview = (dbReview: any, profiles: any[]): Review => {
  const profile = profiles.find(p => p.id === dbReview.user_id);
  return {
    id: dbReview.id,
    courseId: dbReview.course_id,
    userId: dbReview.user_id,
    userName: profile?.name || 'Usuário',
    userAvatar: profile?.avatar,
    rating: dbReview.rating,
    comment: dbReview.comment,
    createdAt: dbReview.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    helpful: dbReview.helpful
  };
};

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    category: 'all',
    status: 'all',
    search: ''
  });

  // Fetch all data from database
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      setCourses((coursesData || []).map(mapDbCourse));

      // Fetch enrollments for current user
      if (user) {
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id);

        if (enrollmentsError) throw enrollmentsError;
        setEnrollments((enrollmentsData || []).map(mapDbEnrollment));
      }

      // Fetch reviews with profiles for user names
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch profiles for review authors
      const userIds = [...new Set((reviewsData || []).map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, avatar')
        .in('id', userIds.length > 0 ? userIds : ['none']);

      setReviews((reviewsData || []).map(r => mapDbReview(r, profilesData || [])));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshData]);

  const getFilteredCourses = useCallback(() => {
    return courses.filter(course => {
      if (filters.category && filters.category !== 'all' && course.category !== filters.category) {
        return false;
      }
      if (filters.status && filters.status !== 'all' && course.status !== filters.status) {
        return false;
      }
      if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [courses, filters]);

  const getCourseById = useCallback((id: string) => {
    return courses.find(course => course.id === id);
  }, [courses]);

  const getEnrolledCourses = useCallback((userId: string) => {
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    return courses.filter(course => 
      userEnrollments.some(e => e.courseId === course.id)
    );
  }, [courses, enrollments]);

  const getEnrollmentByCourseId = useCallback((courseId: string, userId: string) => {
    return enrollments.find(e => e.courseId === courseId && e.userId === userId);
  }, [enrollments]);

  const getReviewsByCourseId = useCallback((courseId: string) => {
    return reviews.filter(r => r.courseId === courseId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews]);

  const getCourseAverageRating = useCallback((courseId: string) => {
    const courseReviews = reviews.filter(r => r.courseId === courseId);
    if (courseReviews.length === 0) return 0;
    const sum = courseReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / courseReviews.length) * 10) / 10;
  }, [reviews]);

  const enrollInCourse = useCallback(async (courseId: string, userId: string) => {
    const { error } = await supabase
      .from('enrollments')
      .insert({
        course_id: courseId,
        user_id: userId,
        status: 'active',
        progress: 0
      });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Você já está matriculado neste curso');
      }
      throw error;
    }

    await refreshData();
  }, [refreshData]);

  const updateEnrollmentProgress = useCallback(async (enrollmentId: string, progress: number) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('id', enrollmentId);

    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const markCourseComplete = useCallback(async (enrollmentId: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ 
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', enrollmentId);

    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const addCourse = useCallback(async (courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => {
    // Validate business rules
    if (!courseData.instructor) {
      throw new Error('Curso precisa ter um professor');
    }
    if (courseData.status === 'published' && !courseData.description) {
      throw new Error('Curso publicado precisa ter descrição');
    }

    const { error } = await supabase
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        instructor: courseData.instructor,
        thumbnail: courseData.thumbnail,
        duration: courseData.duration,
        lessons: courseData.lessons,
        status: courseData.status,
        price: courseData.price
      });

    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const updateCourse = useCallback(async (id: string, updates: Partial<Course>) => {
    // Validate business rules
    if (updates.status === 'published') {
      const course = courses.find(c => c.id === id);
      const description = updates.description ?? course?.description;
      if (!description) {
        throw new Error('Curso publicado precisa ter descrição');
      }
    }

    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.instructor !== undefined) dbUpdates.instructor = updates.instructor;
    if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
    if (updates.lessons !== undefined) dbUpdates.lessons = updates.lessons;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.price !== undefined) dbUpdates.price = updates.price;

    const { error } = await supabase
      .from('courses')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;
    await refreshData();
  }, [courses, refreshData]);

  const updateCourseStatus = useCallback(async (id: string, status: CourseStatus) => {
    await updateCourse(id, { status });
  }, [updateCourse]);

  const deleteCourse = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const addReview = useCallback(async (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const { error } = await supabase
      .from('reviews')
      .insert({
        course_id: reviewData.courseId,
        user_id: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Você já avaliou este curso');
      }
      throw error;
    }

    await refreshData();
  }, [refreshData]);

  const markReviewHelpful = useCallback(async (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const { error } = await supabase
      .from('reviews')
      .update({ helpful: review.helpful + 1 })
      .eq('id', reviewId);

    if (error) throw error;
    await refreshData();
  }, [reviews, refreshData]);

  return (
    <CourseContext.Provider value={{
      courses,
      enrollments,
      reviews,
      filters,
      isLoading,
      setFilters,
      getFilteredCourses,
      getCourseById,
      getEnrolledCourses,
      getEnrollmentByCourseId,
      getReviewsByCourseId,
      getCourseAverageRating,
      enrollInCourse,
      updateEnrollmentProgress,
      markCourseComplete,
      addCourse,
      updateCourse,
      updateCourseStatus,
      deleteCourse,
      addReview,
      markReviewHelpful,
      refreshData
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
