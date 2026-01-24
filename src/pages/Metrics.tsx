import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Leaf, Recycle, TrendingUp, Scale, BarChart3, PieChart } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const mockMonthlyData = [
  { month: 'Jan', peso: 1200, co2: 480, coletas: 15 },
  { month: 'Fev', peso: 1450, co2: 580, coletas: 18 },
  { month: 'Mar', peso: 1380, co2: 552, coletas: 17 },
  { month: 'Abr', peso: 1620, co2: 648, coletas: 22 },
  { month: 'Mai', peso: 1890, co2: 756, coletas: 25 },
  { month: 'Jun', peso: 2100, co2: 840, coletas: 28 },
];

const mockCategoryData = [
  { name: 'Plástico', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Metal', value: 25, color: 'hsl(var(--accent))' },
  { name: 'Papel', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Vidro', value: 12, color: 'hsl(var(--warning))' },
  { name: 'Eletrônicos', value: 8, color: 'hsl(var(--info))' },
];

export default function Metrics() {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['environmental-metrics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('environmental_metrics')
        .select('*')
        .order('period_end', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Métricas ESG" subtitle="Carregando...">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Métricas ESG"
      subtitle="Acompanhe os indicadores ambientais e de sustentabilidade"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="CO₂ Evitado"
            value={`${metrics?.co2_avoided_kg?.toLocaleString('pt-BR') || '2.856'} kg`}
            trend={{ value: 12.5, isPositive: true }}
            icon={Leaf}
            iconColor="text-success"
          />
          <MetricCard
            title="Material Reciclado"
            value={`${metrics?.total_weight_kg?.toLocaleString('pt-BR') || '8.640'} kg`}
            trend={{ value: 8.2, isPositive: true }}
            icon={Recycle}
            iconColor="text-primary"
          />
          <MetricCard
            title="Taxa de Reciclagem"
            value={`${metrics?.recycling_rate || 94}%`}
            trend={{ value: 3.1, isPositive: true }}
            icon={TrendingUp}
            iconColor="text-accent"
          />
          <MetricCard
            title="Materiais Processados"
            value={metrics?.materials_recycled?.toLocaleString('pt-BR') || '156'}
            trend={{ value: 15.3, isPositive: true }}
            icon={Scale}
            iconColor="text-info"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Area Chart - Evolution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Evolução Mensal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyData}>
                    <defs>
                      <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="peso"
                      name="Peso (kg)"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorPeso)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      name="CO₂ (kg)"
                      stroke="hsl(var(--accent))"
                      fill="url(#colorCo2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-accent" />
                <CardTitle>Por Categoria</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Participação']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {mockCategoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-muted-foreground">{category.name}</span>
                    </div>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart - Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Coletas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="coletas" 
                    name="Coletas"
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
