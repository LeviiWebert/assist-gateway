
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ClientsPage = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*');
          
        if (error) throw error;
        
        setClients(data || []);
      } catch (error: any) {
        console.error("Erreur lors du chargement des clients:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les clients.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des clients</h1>
          <p className="text-muted-foreground">
            Consultez et gérez les clients de l'entreprise.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau client</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des clients...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.nom_entreprise}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.tel}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
