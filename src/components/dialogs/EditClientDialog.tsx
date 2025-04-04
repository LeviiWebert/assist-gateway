
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import ClientForm from "@/components/forms/ClientForm";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/models";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: () => void;
  client: Client;
}

const EditClientDialog = ({ open, onOpenChange, onClientUpdated, client }: EditClientDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: {
    nomEntreprise: string;
    email?: string;
    tel?: string;
    identifiant?: string;
    mdp?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          nom_entreprise: values.nomEntreprise,
          email: values.email || null,
          tel: values.tel || null,
          identifiant: values.identifiant || null,
          mdp: values.mdp || null,
        })
        .eq("id", client.id);

      if (error) throw error;

      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
      
      onOpenChange(false);
      onClientUpdated();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de mettre à jour le client: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>
        <ClientForm onSubmit={handleSubmit} initialData={client} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
