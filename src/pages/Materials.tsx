import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MATERIAL_STATUS } from '@/lib/constants';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateMaterialModal } from '@/components/materials/CreateMaterialModal';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Materials() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false); // ✅ estado do modal no lugar certo

  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          id,
          name,
          description,
          quantity,
          unit,
          weight_kg,
          status,
          created_at,
          category:material_categories (
            id,
            name,
            icon
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredMaterials = materials?.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Materiais"
      subtitle="Gerencie os materiais para logística reversa"
      actions={
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus size={18} />
          Novo Material
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              Lista de Materiais
            </CardTitle>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Buscar materiais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredMaterials && filteredMaterials.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Peso (kg)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredMaterials.map((material) => {
                    const status =
                      material.status as keyof typeof MATERIAL_STATUS;

                    const statusInfo =
                      MATERIAL_STATUS[status] ||
                      MATERIAL_STATUS.pendente;

                    return (
                      <TableRow
                        key={material.id}
                        className="cursor-pointer hover:bg-muted/30"
                      >
                        <TableCell className="font-medium">
                          {material.name}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {material.category?.name || 'Sem categoria'}
                        </TableCell>

                        <TableCell className="text-right">
                          {material.quantity} {material.unit || 'un'}
                        </TableCell>

                        <TableCell className="text-right">
                          {material.weight_kg.toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            status={statusInfo.color}
                            label={statusInfo.label}
                          />
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {format(
                            new Date(material.created_at),
                            'dd/MM/yyyy',
                            { locale: ptBR }
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="Nenhum material cadastrado"
              description="Comece cadastrando seus materiais para logística reversa"
              action={
                <Button className="gap-2" onClick={() => setOpen(true)}>
                  <Plus size={18} />
                  Cadastrar Material
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* ✅ Modal renderizado UMA vez, no nível da página */}
      {open && (
        <CreateMaterialModal
          onSuccess={() => {
            setOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
