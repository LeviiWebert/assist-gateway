
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, FileText, User } from "lucide-react";

export const QuickActions = () => {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <Link to="/intervention/request" className="p-6 hover:bg-muted/50 transition-colors flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Nouvelle demande</h3>
              <p className="text-sm text-muted-foreground mt-1">Créer une nouvelle demande d'intervention</p>
            </Link>
            <Link to="/client/interventions" className="p-6 hover:bg-muted/50 transition-colors flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Mes interventions</h3>
              <p className="text-sm text-muted-foreground mt-1">Consulter l'historique de vos interventions</p>
            </Link>
            <Link to="/client/profile" className="p-6 hover:bg-muted/50 transition-colors flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Mon profil</h3>
              <p className="text-sm text-muted-foreground mt-1">Gérer vos informations personnelles</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
