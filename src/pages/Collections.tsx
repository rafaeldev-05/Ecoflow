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
import { COLLECTION_STATUS } from '@/lib/constants';
import { Truck, Plus, Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

export default function Collections() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          material:materials(name, weight_kg)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const filteredCollections = collections?.filter(collection =>
    collection.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.material?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Coletas"
      subtitle="Gerencie solicitações e acompanhe o status das coletas"
      actions={
        <Button className="gap-2">
          <Plus size={18} />
          Nova Coleta
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">Lista de Coletas</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar coletas..."
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
          ) : filteredCollections && filteredCollections.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Material</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Data Agendada</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((collection) => {
                    const status = collection.status as keyof typeof COLLECTION_STATUS;
                    const statusInfo = COLLECTION_STATUS[status] || COLLECTION_STATUS.agendada;
                    
                    return (
                      <TableRow key={collection.id} className="cursor-pointer hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {collection.material?.name || 'Material não especificado'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={14} />
                            <span className="truncate max-w-[200px]">{collection.pickup_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            {format(new Date(collection.scheduled_date), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {collection.driver_name || '—'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={statusInfo.color as any} 
                            label={statusInfo.label} 
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Truck}
              title="Nenhuma coleta registrada"
              description="Solicite uma nova coleta para seus materiais"
              action={
                <Button className="gap-2">
                  <Plus size={18} />
                  Solicitar Coleta
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
