import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createCollection } from "@/integrations/supabase/collections";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onSuccess: () => void;
}

export function CreateCollectionModal({ onSuccess }: Props) {
  const { user } = useAuth();

  const [materialId, setMaterialId] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!user) return;

    if (!materialId || !pickupAddress || !scheduledDate) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      await createCollection({
        user_id: user.id,               // UUID real
        material_id: materialId,        // UUID do material
        pickup_address: pickupAddress,
        scheduled_date: scheduledDate,
        status: "agendada",             // status válido do enum
      });

      onSuccess();
    } catch (error: any) {
      alert(error.message || "Erro ao criar coleta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onSuccess}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Coleta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="ID do material"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          />

          <Input
            placeholder="Endereço de coleta"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />

          <Input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Salvando..." : "Solicitar Coleta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
