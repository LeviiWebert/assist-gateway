
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InterventionStatusBadge } from "@/components/interventions/InterventionStatusBadge";
import { PriorityBadge } from "@/components/interventions/PriorityBadge";

interface InterventionRequestsTableProps {
  requests: any[];
  onAccept: (request: any) => void;
  onReject: (request: any) => void;
}

export const InterventionRequestsTable = ({ 
  requests, 
  onAccept, 
  onReject 
}: InterventionRequestsTableProps) => {
  return (
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
                    onClick={() => onAccept(request)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-500 hover:bg-red-500 hover:text-white text-red-500"
                    onClick={() => onReject(request)}
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
  );
};
