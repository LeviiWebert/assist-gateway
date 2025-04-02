
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { demandeInterventionService } from "@/services/dataService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { InterventionStatusBadge } from "@/components/interventions/InterventionStatusBadge";
import { PriorityBadge } from "@/components/interventions/PriorityBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const InterventionRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [toast]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Utiliser directement Supabase pour récupérer les demandes en attente avec les détails du client
      const { data, error } = await supabase
        .from('demande_interventions')
        .select(`
          *,
          client:client_id (
            id,
            nom_entreprise,
            email,
            tel
          )
        `)
        .eq('statut', 'en_attente');
        
      if (error) throw error;
      
      console.log("Demandes d'intervention récupérées:", data);
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching intervention requests:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les demandes d'intervention.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (request: any) => {
    setSelectedRequest(request);
    setActionType("accept");
    setDialogOpen(true);
  };

  const handleReject = (request: any) => {
    setSelectedRequest(request);
    setActionType("reject");
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    
    try {
      // Déterminer le nouveau statut
      const newStatus = actionType === "accept" ? "validée" : "rejetée";
      
      // Mettre à jour le statut de la demande dans Supabase
      const { error } = await supabase
        .from('demande_interventions')
        .update({ statut: newStatus })
        .eq('id', selectedRequest.id);
      
      if (error) throw error;
      
      // Mettre à jour l'interface utilisateur
      setRequests(requests.filter(req => req.id !== selectedRequest.id));
      
      toast({
        title: actionType === "accept" ? "Demande acceptée" : "Demande rejetée",
        description: `La demande de ${selectedRequest.client?.nom_entreprise || 'client'} a été ${newStatus}.`,
      });
      
      // Si la demande est acceptée, créer une intervention
      if (actionType === "accept") {
        // Ici, vous pourriez ajouter le code pour créer une nouvelle intervention
        // Exemple: appeler un service ou insérer directement dans Supabase
      }
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la demande:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour.",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Demandes d'intervention</h1>
        <p className="text-muted-foreground">
          Gérez les nouvelles demandes d'intervention reçues.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des demandes...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Urgence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {format(new Date(request.date_demande), "dd/MM/yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>{request.client?.nom_entreprise || 'Client inconnu'}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {request.description}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={request.urgence} />
                    </TableCell>
                    <TableCell>
                      <InterventionStatusBadge status={request.statut} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-green-500 hover:bg-green-500 hover:text-white text-green-500"
                        onClick={() => handleAccept(request)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-red-500 hover:bg-red-500 hover:text-white text-red-500"
                        onClick={() => handleReject(request)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Refuser
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune demande d'intervention en attente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Accepter la demande" : "Refuser la demande"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? "Cette action créera une nouvelle intervention basée sur cette demande. Voulez-vous continuer ?"
                : "Cette action refusera définitivement la demande. Voulez-vous continuer ?"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <p className="font-medium">{selectedRequest.client?.nom_entreprise || 'Client'}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedRequest.description}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Urgence:</span>
                <PriorityBadge priority={selectedRequest.urgence} />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant={actionType === "accept" ? "default" : "destructive"} 
              onClick={confirmAction}
            >
              {actionType === "accept" ? "Accepter" : "Refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterventionRequests;
