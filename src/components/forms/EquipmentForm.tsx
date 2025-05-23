
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Materiel } from "@/types/models";
import { BaseAutocompleteInput } from "@/components/form/BaseAutocompleteInput";

// Schema du formulaire matériel
const equipmentSchema = z.object({
  reference: z.string().min(2, { message: "La référence doit contenir au moins 2 caractères" }),
  typeMateriel: z.string().min(2, { message: "Le type de matériel est requis" }),
  etat: z.enum(["disponible", "en utilisation", "en maintenance", "hors service"]),
  base: z.object({
    id: z.string().nullable(),
    label: z.string()
  }).refine(val => typeof val.label === "string" && val.label.trim().length > 0, { message: "La base de stockage est requise" }),
});

// Export type
export type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  onSubmit: (values: EquipmentFormValues) => void;
  initialData?: Partial<Materiel> & { base_id?: string, baseNom?: string };
  isSubmitting: boolean;
}

const EquipmentForm = ({ onSubmit, initialData, isSubmitting }: EquipmentFormProps) => {
  // Remplir base à partir des props si modification
  const [baseState, setBaseState] = useState<{ id: string | null; label: string }>({
    id: typeof initialData?.base_id === "string" ? initialData?.base_id : null,
    label: typeof (initialData as any)?.baseNom === "string" ? (initialData as any).baseNom : "",
  });

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      reference: initialData?.reference || "",
      typeMateriel: initialData?.typeMateriel || "",
      etat: (initialData?.etat as any) || "disponible",
      base: {
        id: baseState.id,
        label: baseState.label,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence</FormLabel>
              <FormControl>
                <Input placeholder="Référence du matériel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeMateriel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de matériel</FormLabel>
              <FormControl>
                <Input placeholder="Type de matériel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base de stockage</FormLabel>
              <FormControl>
                <BaseAutocompleteInput
                  value={{
                    id: field.value.id,
                    label: field.value.label || ""
                  }}
                  onChange={(val) => {
                    // S'assurer que les valeurs ne sont jamais undefined
                    field.onChange({
                      id: val.id,
                      label: val.label || ""
                    });
                  }}
                  disabled={isSubmitting}
                  placeholder="Nom de la base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>État</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en utilisation">En utilisation</SelectItem>
                  <SelectItem value="en maintenance">En maintenance</SelectItem>
                  <SelectItem value="hors service">Hors service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </span>
          ) : initialData?.id ? "Mettre à jour" : "Créer" }
        </Button>
      </form>
    </Form>
  );
};

export default EquipmentForm;
