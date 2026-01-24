// Demo users for quick access
export const DEMO_USERS = {
  operacional: {
    email: 'operacional@ecoflow.demo',
    password: 'demo123456',
    role: 'operacional',
    name: 'Maria Silva',
    description: 'Solicita coletas e acompanha status'
  },
  gestor: {
    email: 'gestor@ecoflow.demo',
    password: 'demo123456',
    role: 'gestor',
    name: 'João Santos',
    description: 'Visualiza métricas e indicadores'
  },
  admin: {
    email: 'admin@ecoflow.demo',
    password: 'demo123456',
    role: 'admin',
    name: 'Ana Costa',
    description: 'Gerencia usuários e operações'
  }
} as const;

// Collection status labels and colors
export const COLLECTION_STATUS = {
  agendada: { label: 'Agendada', color: 'info' },
  em_transito: { label: 'Em Trânsito', color: 'warning' },
  coletada: { label: 'Coletada', color: 'accent' },
  processando: { label: 'Processando', color: 'primary' },
  concluida: { label: 'Concluída', color: 'success' },
  cancelada: { label: 'Cancelada', color: 'destructive' }
} as const;

// Material status labels
export const MATERIAL_STATUS = {
  pendente: { label: 'Pendente', color: 'muted' },
  coletado: { label: 'Coletado', color: 'info' },
  processado: { label: 'Processado', color: 'primary' },
  destinado: { label: 'Destinado', color: 'success' }
} as const;

// Navigation items by role
export const NAV_ITEMS = {
  operacional: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Materiais', path: '/materials', icon: 'Package' },
    { label: 'Coletas', path: '/collections', icon: 'Truck' },
    { label: 'Configurações', path: '/settings', icon: 'Settings' }
  ],
  gestor: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Materiais', path: '/materials', icon: 'Package' },
    { label: 'Coletas', path: '/collections', icon: 'Truck' },
    { label: 'Métricas', path: '/metrics', icon: 'BarChart3' },
    { label: 'Configurações', path: '/settings', icon: 'Settings' }
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Materiais', path: '/materials', icon: 'Package' },
    { label: 'Coletas', path: '/collections', icon: 'Truck' },
    { label: 'Métricas', path: '/metrics', icon: 'BarChart3' },
    { label: 'Usuários', path: '/users', icon: 'Users' },
    { label: 'Configurações', path: '/settings', icon: 'Settings' }
  ]
} as const;

// App info
export const APP_INFO = {
  name: 'EcoFlow',
  tagline: 'Logística Reversa Inteligente',
  description: 'Plataforma completa para gestão de resíduos, logística reversa e métricas ESG',
  version: '1.0.0'
} as const;
