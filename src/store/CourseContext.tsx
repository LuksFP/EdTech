import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course, Enrollment, CourseFilters, CourseStatus } from '@/types';
import { mockCourses, mockEnrollments } from '@/services/mockData';

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  filters: CourseFilters;
  setFilters: (filters: CourseFilters) => void;
  getFilteredCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getEnrolledCourses: (userId: string) => Course[];
  getEnrollmentByCourseId: (courseId: string, userId: string) => Enrollment | undefined;
  enrollInCourse: (courseId: string, userId: string) => void;
  updateEnrollmentProgress: (enrollmentId: string, progress: number) => void;
  markCourseComplete: (enrollmentId: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'rating' | 'studentsCount'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  updateCourseStatus: (id: string, status: CourseStatus) => void;
  deleteCourse: (id: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
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

  return (
    <CourseContext.Provider value={{
      courses,
      enrollments,
      filters,
      setFilters,
      getFilteredCourses,
      getCourseById,
      getEnrolledCourses,
      getEnrollmentByCourseId,
      enrollInCourse,
      updateEnrollmentProgress,
      markCourseComplete,
      addCourse,
      updateCourse,
      updateCourseStatus,
      deleteCourse
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
