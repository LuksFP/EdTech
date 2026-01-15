import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/store/AuthContext";
import { CourseProvider } from "@/store/CourseContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { RoleRoute } from "@/routes/RoleRoute";

// Pages
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/student/StudentDashboard";
import CourseDetails from "@/pages/CourseDetails";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminReports from "@/pages/admin/AdminReports";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <CourseProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Student Routes */}
                <Route 
                  path="/student" 
                  element={
                    <PrivateRoute>
                      <RoleRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </RoleRoute>
                    </PrivateRoute>
                  } 
                />

                {/* Course Details - Both roles can access */}
                <Route 
                  path="/course/:id" 
                  element={
                    <PrivateRoute>
                      <CourseDetails />
                    </PrivateRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <RoleRoute allowedRoles={['admin']}>
                        <AdminLayout />
                      </RoleRoute>
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="students" element={<AdminStudents />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<div className="p-8 text-muted-foreground">Configurações em breve...</div>} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CourseProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
