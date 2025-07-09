
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState } from "react";

import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Booking from "./pages/Booking";
import BookingTest from "./pages/BookingTest";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import Study from "./pages/Study";
import Quizzes from "./pages/Quizzes";
import MockExam from "./pages/MockExam";
import Logbook from "./pages/Logbook";
import BookTest from "./pages/BookTest";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import { useAuth } from "./hooks/useAuth";
import AvailabilityManager from "./pages/AvailabilityManager";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} />;
  }

  return <>{children}</>;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-test" element={<BookingTest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/availability" 
              element={
                <AdminProtectedRoute>
                  <AvailabilityManager />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/client-portal" 
              element={
                <ProtectedRoute>
                  <ClientPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/study" 
              element={
                <ProtectedRoute>
                  <Study />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <ProtectedRoute>
                  <Quizzes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-exam" 
              element={
                <ProtectedRoute>
                  <MockExam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/logbook" 
              element={
                <ProtectedRoute>
                  <Logbook />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-test" 
              element={
                <ProtectedRoute>
                  <BookTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } 
            />
            <Route path="/sitemap.xml" element={null} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
