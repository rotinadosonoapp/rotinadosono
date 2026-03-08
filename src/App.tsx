import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Context
import { AuthProvider } from "@/contexts/AuthContext";

// Route Guards
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

// Pages - Public
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Pages - Auth
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Pages - Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminPayments from "./pages/admin/AdminPayments";

// Pages - Dashboard (Aluno)
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardCourses from "./pages/dashboard/DashboardCourses";
import DashboardCourseDetail from "./pages/dashboard/DashboardCourseDetail";
import DashboardBilling from "./pages/dashboard/DashboardBilling";
import DashboardProfile from "./pages/dashboard/DashboardProfile";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />

              {/* Auth Routes (redirect if logged in) */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/cadastro"
                element={
                  <PublicOnlyRoute>
                    <Cadastro />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin Routes (require admin role) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/:courseId/lessons"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLessons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPayments />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Routes (require login) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/courses"
                element={
                  <ProtectedRoute>
                    <DashboardCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <DashboardCourseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/billing"
                element={
                  <ProtectedRoute>
                    <DashboardBilling />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <DashboardProfile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
