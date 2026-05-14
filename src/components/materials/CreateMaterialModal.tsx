import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createMaterial } from "@/services/materialsApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  onSuccess: () => void;
}

export function CreateMaterialModal({ onSuccess }: Props) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!user) return;

    setLoading(true);

    try {
      await createMaterial({
        name,
        description,
        quantity: 1,
        unit: "kg",
        weight_kg: 1,
        user_id: user.id,
        category_id: null,
      });

      onSuccess();
    } catch (error) {
      console.error("Erro ao cadastrar material:", error);
      toast.error("Nao foi possivel cadastrar o material. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onSuccess}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Material</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nome do material"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Salvando..." : "Salvar Material"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
