import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createCollection } from "@/services/collectionsApi";
import { fetchMaterials, type MaterialApiItem } from "@/services/materialsApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  onSuccess: () => void;
}

export function CreateCollectionModal({ onSuccess }: Props) {
  const { user } = useAuth();

  const [materialId, setMaterialId] = useState("");
  const [materials, setMaterials] = useState<MaterialApiItem[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let ignore = false;

    async function loadMaterials() {
      setMaterialsLoading(true);
      setMaterialsError("");

      try {
        const data = await fetchMaterials(user.id);

        if (!ignore) {
          setMaterials(data);
        }
      } catch (error: unknown) {
        if (!ignore) {
          const message =
            error instanceof Error
              ? error.message
              : "Nao foi possivel carregar os materiais.";

          setMaterialsError(message);
          toast.error(message);
        }
      } finally {
        if (!ignore) {
          setMaterialsLoading(false);
        }
      }
    }

    loadMaterials();

    return () => {
      ignore = true;
    };
  }, [user]);

  function getMaterialLabel(material: MaterialApiItem) {
    const quantity = new Intl.NumberFormat("pt-BR").format(material.quantity);
    const unit = material.unit?.trim();

    if (unit) {
      return `${material.name} - ${quantity} ${unit}`;
    }

    return `${material.name} - ${material.weight_kg} kg`;
  }

  async function handleCreate() {
    if (!user) return;

    if (!materialId) {
      toast.error("Selecione um material para solicitar a coleta.");
      return;
    }

    if (!pickupAddress || !scheduledDate) {
      toast.error("Preencha endereco e data da coleta.");
      return;
    }

    setLoading(true);

    try {
      await createCollection({
        user_id: user.id,
        material_id: materialId,
        pickup_address: pickupAddress,
        scheduled_date: scheduledDate,
        status: "agendada",
      });

      toast.success("Coleta solicitada com sucesso.");
      onSuccess();
    } catch (error: unknown) {
      console.error("Erro ao criar coleta:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a coleta. Tente novamente.",
      );
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
          <div className="space-y-2">
            <Select
              value={materialId}
              onValueChange={setMaterialId}
              disabled={materialsLoading || materials.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    materialsLoading ? "Carregando materiais..." : "Selecione um material"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {getMaterialLabel(material)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!materialsLoading && materials.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Cadastre um material antes de solicitar uma coleta.
              </p>
            )}

            {materialsError && (
              <p className="text-sm text-destructive">{materialsError}</p>
            )}
          </div>

          <Input
            placeholder="Endereco de coleta"
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
            disabled={loading || materialsLoading || materials.length === 0}
            className="w-full"
          >
            {loading ? "Salvando..." : "Solicitar Coleta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
