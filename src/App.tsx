
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import BookingTest from "./pages/BookingTest";
import BookTest from "./pages/BookTest";
import Auth from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import Study from "./pages/Study";
import MockExam from "./pages/MockExam";
import Logbook from "./pages/Logbook";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import AvailabilityManager from "./pages/AvailabilityManager";
import QuizAdmin from "./pages/QuizAdmin";
import Quizzes from "./pages/Quizzes";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogDashboard from "./pages/BlogDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-test" element={<BookingTest />} />
              <Route path="/book-test" element={<BookTest />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/study" element={<Study />} />
              <Route path="/mock-exam" element={<MockExam />} />
              <Route path="/logbook" element={<Logbook />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/availability" element={
                <AdminProtectedRoute>
                  <AvailabilityManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/quiz" element={
                <AdminProtectedRoute>
                  <QuizAdmin />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/blog" element={
                <AdminProtectedRoute>
                  <BlogDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
