import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course, Enrollment, CourseFilters, CourseStatus, Review } from '@/types';
import { mockCourses, mockEnrollments, mockReviews } from '@/services/mockData';

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  reviews: Review[];
  filters: CourseFilters;
  setFilters: (filters: CourseFilters) => void;
  getFilteredCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getEnrolledCourses: (userId: string) => Course[];
  getEnrollmentByCourseId: (courseId: string, userId: string) => Enrollment | undefined;
  getReviewsByCourseId: (courseId: string) => Review[];
  getCourseAverageRating: (courseId: string) => number;
  enrollInCourse: (courseId: string, userId: string) => void;
  updateEnrollmentProgress: (enrollmentId: string, progress: number) => void;
  markCourseComplete: (enrollmentId: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  updateCourseStatus: (id: string, status: CourseStatus) => void;
  deleteCourse: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  markReviewHelpful: (reviewId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filters, setFilters] = useState<CourseFilters>({
    category: 'all',
    status: 'all',
    search: ''
  });

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

  const enrollInCourse = useCallback((courseId: string, userId: string) => {
    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      courseId,
      userId,
      status: 'active',
      progress: 0,
      enrolledAt: new Date().toISOString().split('T')[0]
    };
    setEnrollments(prev => [...prev, newEnrollment]);
  }, []);

  const updateEnrollmentProgress = useCallback((enrollmentId: string, progress: number) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId ? { ...e, progress } : e
    ));
  }, []);

  const markCourseComplete = useCallback((enrollmentId: string) => {
    setEnrollments(prev => prev.map(e => 
      e.id === enrollmentId 
        ? { ...e, status: 'completed' as const, progress: 100, completedAt: new Date().toISOString().split('T')[0] }
        : e
    ));
  }, []);

  const addCourse = useCallback((courseData: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      studentsCount: 0
    };
    setCourses(prev => [...prev, newCourse]);
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  }, []);

  const updateCourseStatus = useCallback((id: string, status: CourseStatus) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, status } : course
    ));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    setReviews(prev => [...prev, newReview]);
    
    // Update course rating
    const courseReviews = [...reviews, newReview].filter(r => r.courseId === reviewData.courseId);
    const avgRating = courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length;
    setCourses(prev => prev.map(course => 
      course.id === reviewData.courseId 
        ? { ...course, rating: Math.round(avgRating * 10) / 10 }
        : course
    ));
  }, [reviews]);

  const markReviewHelpful = useCallback((reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  }, []);

  return (
    <CourseContext.Provider value={{
      courses,
      enrollments,
      reviews,
      filters,
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
      markReviewHelpful
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
