
import { RouteObject } from "react-router-dom";
import { ClientLayout } from "@/components/layout/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientInterventionsList from "@/pages/client/InterventionsList";
import ClientInterventionDetails from "@/pages/client/InterventionDetails";
import InterventionRecap from "@/pages/client/InterventionRecap";
import { ProtectedClientRoute } from "@/components/auth/ProtectedClientRoute";
import ProcessVerbalClient from "@/pages/client/ProcessVerbalClient";
import PVList from "@/pages/client/PVList";
import NotFound from "@/pages/NotFound";
import RequestIntervention from "@/pages/intervention/RequestIntervention";
import InterventionDetails from "@/pages/intervention/InterventionDetails";
import InterventionSchedule from "@/pages/intervention/InterventionSchedule";
import PVClientPage from "@/pages/client/PVClientPage";
import ClientInvoices from "@/pages/client/ClientInvoices";
import ClientInvoiceDetails from "@/pages/client/ClientInvoiceDetails";

// Helper function to wrap client components with protection and layout
const withClientProtection = (Component: React.ComponentType<any>) => (
  <ProtectedClientRoute>
    <ClientLayout>
      <Component />
    </ClientLayout>
  </ProtectedClientRoute>
);

// Client routes configuration
export const clientRoutes: RouteObject[] = [
  {
    path: "/client-dashboard",
    element: withClientProtection(ClientDashboard)
  },
  {
    path: "/client/profile",
    element: withClientProtection(ClientProfile)
  },
  {
    path: "/client/interventions",
    element: withClientProtection(ClientInterventionsList)
  },
  {
    path: "/client/intervention/:id",
    element: withClientProtection(ClientInterventionDetails)
  },
  {
    path: "/client/intervention/recap/:id",
    element: withClientProtection(InterventionRecap)
  },
  {
    path: "/client/pv/:id",
    element: withClientProtection(ProcessVerbalClient)
  },
  {
    path: "/client/pvs",
    element: withClientProtection(PVList)
  },
  // Ajout des routes pour la demande d'intervention protégées
  {
    path: "/intervention/request",
    element: withClientProtection(RequestIntervention)
  },
  {
    path: "/intervention/details",
    element: withClientProtection(InterventionDetails) 
  },
  {
    path: "/intervention/schedule",
    element: withClientProtection(InterventionSchedule)
  },
  // Add a catch-all for client routes to show a proper message
  {
    path: "/client/*",
    element: withClientProtection(NotFound)
  },
  {
    path: "/client/pvs",
    element: withClientProtection(PVList)
  },
  {
    path: "/client/pv/:id",
    element: withClientProtection(PVClientPage)
  },
  // Nouvelles routes pour les factures
  {
    path: "/client/invoices",
    element: withClientProtection(ClientInvoices)
  },
  {
    path: "/client/invoice/:id",
    element: withClientProtection(ClientInvoiceDetails)
  }
];
