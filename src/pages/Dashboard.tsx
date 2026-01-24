import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Recycle, Leaf, Truck, TrendingUp, Package, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { month: 'Jan', reciclado: 120, coletado: 150 },
  { month: 'Fev', reciclado: 180, coletado: 200 },
  { month: 'Mar', reciclado: 250, coletado: 280 },
  { month: 'Abr', reciclado: 320, coletado: 350 },
  { month: 'Mai', reciclado: 400, coletado: 420 },
  { month: 'Jun', reciclado: 480, coletado: 520 },
];

export default function Dashboard() {
  const { profile, role } = useAuth();
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalCollections: 0,
    pendingCollections: 0,
    co2Avoided: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const [materialsRes, collectionsRes] = await Promise.all([
        supabase.from('materials').select('id, weight_kg', { count: 'exact' }),
        supabase.from('collections').select('id, status', { count: 'exact' })
      ]);

      const totalWeight = materialsRes.data?.reduce((acc, m) => acc + Number(m.weight_kg), 0) || 0;
      const pendingCount = collectionsRes.data?.filter(c => c.status === 'agendada').length || 0;

      setStats({
        totalMaterials: materialsRes.count || 0,
        totalCollections: collectionsRes.count || 0,
        pendingCollections: pendingCount,
        co2Avoided: Math.round(totalWeight * 2.5)
      });
    }
    fetchStats();
  }, []);

  return (
    <DashboardLayout
      title={`Olá, ${profile?.full_name?.split(' ')[0] || 'Usuário'}!`}
      description="Acompanhe suas métricas de sustentabilidade"
    >
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="CO₂ Evitado"
            value={`${stats.co2Avoided} kg`}
            subtitle="Impacto ambiental positivo"
            icon={Leaf}
            accentColor="success"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Materiais Registrados"
            value={stats.totalMaterials}
            subtitle="Total de materiais"
            icon={Package}
            accentColor="primary"
          />
          <MetricCard
            title="Coletas Realizadas"
            value={stats.totalCollections}
            subtitle="Total de coletas"
            icon={Truck}
            accentColor="accent"
          />
          <MetricCard
            title="Coletas Pendentes"
            value={stats.pendingCollections}
            subtitle="Aguardando coleta"
            icon={Clock}
            accentColor="warning"
          />
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="eco-card"
        >
          <h3 className="font-display font-semibold text-lg mb-6">Evolução da Reciclagem</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorReciclado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152 55% 28%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(152 55% 28%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="reciclado" stroke="hsl(152 55% 28%)" fillOpacity={1} fill="url(#colorReciclado)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
