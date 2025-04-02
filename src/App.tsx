
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackOfficeLayout } from "./components/layout/BackOfficeLayout";
import { ClientLayout } from "./components/layout/ClientLayout";
import Dashboard from "./pages/Dashboard";
import InterventionsPage from "./pages/InterventionsPage";
import InterventionRequests from "./pages/InterventionRequests";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/client/ClientDashboard";
import Contact from "./pages/Contact";
import RequestIntervention from "./pages/intervention/RequestIntervention";
import InterventionDetails from "./pages/intervention/InterventionDetails";
import InterventionSchedule from "./pages/intervention/InterventionSchedule";
import InterventionRecap from "./pages/client/InterventionRecap";
import ClientProfile from "./pages/client/ClientProfile";
import ClientInterventionsList from "./pages/client/InterventionsList";
import ClientInterventionDetails from "./pages/client/InterventionDetails";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserType(session?.user?.user_metadata?.user_type || null);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserType(session?.user?.user_metadata?.user_type || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Routes de demande d'intervention */}
            <Route path="/intervention/request" element={<RequestIntervention />} />
            <Route path="/intervention/details" element={<InterventionDetails />} />
            <Route path="/intervention/schedule" element={<InterventionSchedule />} />
            
            {/* Routes du back-office (admin) */}
            <Route path="/admin" element={
              session && userType === "admin" ? (
                <BackOfficeLayout>
                  <Dashboard />
                </BackOfficeLayout>
              ) : (
                <Auth />
              )
            } />
            <Route path="/admin/interventions" element={
              session && userType === "admin" ? (
                <BackOfficeLayout>
                  <InterventionsPage />
                </BackOfficeLayout>
              ) : (
                <Auth />
              )
            } />
            <Route path="/admin/interventions/requests" element={
              session && userType === "admin" ? (
                <BackOfficeLayout>
                  <InterventionRequests />
                </BackOfficeLayout>
              ) : (
                <Auth />
              )
            } />
            
            {/* Routes du front-office (client) */}
            <Route path="/client-dashboard" element={
              session && userType === "client" ? (
                <ClientLayout>
                  <ClientDashboard />
                </ClientLayout>
              ) : (
                <Auth />
              )
            } />
            <Route path="/client/profile" element={
              session && userType === "client" ? (
                <ClientProfile />
              ) : (
                <Auth />
              )
            } />
            <Route path="/client/interventions" element={
              session && userType === "client" ? (
                <ClientInterventionsList />
              ) : (
                <Auth />
              )
            } />
            <Route path="/client/intervention/:id" element={
              session && userType === "client" ? (
                <ClientInterventionDetails />
              ) : (
                <Auth />
              )
            } />
            
            {/* Nouvelle route pour le récapitulatif d'intervention */}
            <Route path="/client/intervention/recap/:id" element={
              session && userType === "client" ? (
                <InterventionRecap />
              ) : (
                <Auth />
              )
            } />
            
            {/* Pour compatibilité avec l'ancienne structure */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
