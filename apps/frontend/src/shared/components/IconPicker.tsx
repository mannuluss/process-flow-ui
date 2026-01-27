import React, { useState } from 'react';
import { Button, Popover, Input, Flex, theme, Tooltip } from 'antd';
import { SearchOutlined, AppstoreAddOutlined } from '@ant-design/icons';

// Material Icons imports - only what's used in registry
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingIcon from '@mui/icons-material/Pending';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagIcon from '@mui/icons-material/Flag';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SyncIcon from '@mui/icons-material/Sync';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoopIcon from '@mui/icons-material/Loop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import WebhookIcon from '@mui/icons-material/Webhook';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArticleIcon from '@mui/icons-material/Article';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MergeIcon from '@mui/icons-material/Merge';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import PublicIcon from '@mui/icons-material/Public';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

// Icon registry with categories
export const ICON_REGISTRY: Record<
  string,
  { component: React.ElementType; label: string; category: string }
> = {
  // Default
  AppstoreAddOutlined: {
    component: AppstoreAddOutlined,
    label: 'Por defecto',
    category: 'General',
  },
  // Status & Progress
  CheckCircle: {
    component: CheckCircleIcon,
    label: 'Completado',
    category: 'Estado',
  },
  TaskAlt: { component: TaskAltIcon, label: 'Tarea OK', category: 'Estado' },
  Pending: { component: PendingIcon, label: 'Pendiente', category: 'Estado' },
  HourglassEmpty: {
    component: HourglassEmptyIcon,
    label: 'Esperando',
    category: 'Estado',
  },
  PlayArrow: { component: PlayArrowIcon, label: 'Iniciar', category: 'Estado' },
  Pause: { component: PauseIcon, label: 'Pausar', category: 'Estado' },
  Stop: { component: StopIcon, label: 'Detener', category: 'Estado' },
  Replay: { component: ReplayIcon, label: 'Reintentar', category: 'Estado' },

  // Communication
  Send: { component: SendIcon, label: 'Enviar', category: 'Comunicación' },
  Email: { component: EmailIcon, label: 'Email', category: 'Comunicación' },
  Notifications: {
    component: NotificationsIcon,
    label: 'Notificación',
    category: 'Comunicación',
  },
  Chat: { component: ChatIcon, label: 'Chat', category: 'Comunicación' },
  Forum: { component: ForumIcon, label: 'Foro', category: 'Comunicación' },
  Campaign: {
    component: CampaignIcon,
    label: 'Campaña',
    category: 'Comunicación',
  },
  Announcement: {
    component: AnnouncementIcon,
    label: 'Anuncio',
    category: 'Comunicación',
  },

  // People & Roles
  Person: { component: PersonIcon, label: 'Persona', category: 'Usuarios' },
  Group: { component: GroupIcon, label: 'Grupo', category: 'Usuarios' },
  SupportAgent: {
    component: SupportAgentIcon,
    label: 'Soporte',
    category: 'Usuarios',
  },
  Engineering: {
    component: EngineeringIcon,
    label: 'Ingeniería',
    category: 'Usuarios',
  },
  AdminPanelSettings: {
    component: AdminPanelSettingsIcon,
    label: 'Admin',
    category: 'Usuarios',
  },

  // Documents
  Description: {
    component: DescriptionIcon,
    label: 'Documento',
    category: 'Documentos',
  },
  Folder: { component: FolderIcon, label: 'Carpeta', category: 'Documentos' },
  AttachFile: {
    component: AttachFileIcon,
    label: 'Adjunto',
    category: 'Documentos',
  },
  Assignment: {
    component: AssignmentIcon,
    label: 'Asignación',
    category: 'Documentos',
  },
  Article: {
    component: ArticleIcon,
    label: 'Artículo',
    category: 'Documentos',
  },
  Receipt: { component: ReceiptIcon, label: 'Recibo', category: 'Documentos' },

  // Actions
  Edit: { component: EditIcon, label: 'Editar', category: 'Acciones' },
  Delete: { component: DeleteIcon, label: 'Eliminar', category: 'Acciones' },
  Add: { component: AddIcon, label: 'Agregar', category: 'Acciones' },
  Search: { component: SearchIcon, label: 'Buscar', category: 'Acciones' },
  FilterList: {
    component: FilterListIcon,
    label: 'Filtrar',
    category: 'Acciones',
  },
  Visibility: { component: VisibilityIcon, label: 'Ver', category: 'Acciones' },

  // Security
  Lock: { component: LockIcon, label: 'Bloquear', category: 'Seguridad' },
  LockOpen: {
    component: LockOpenIcon,
    label: 'Desbloquear',
    category: 'Seguridad',
  },
  Security: {
    component: SecurityIcon,
    label: 'Seguridad',
    category: 'Seguridad',
  },
  VerifiedUser: {
    component: VerifiedUserIcon,
    label: 'Verificado',
    category: 'Seguridad',
  },
  Fingerprint: {
    component: FingerprintIcon,
    label: 'Huella',
    category: 'Seguridad',
  },

  // Business & Finance
  AccountBalance: {
    component: AccountBalanceIcon,
    label: 'Banco',
    category: 'Finanzas',
  },
  Payment: { component: PaymentIcon, label: 'Pago', category: 'Finanzas' },
  CreditCard: {
    component: CreditCardIcon,
    label: 'Tarjeta',
    category: 'Finanzas',
  },
  ShoppingCart: {
    component: ShoppingCartIcon,
    label: 'Carrito',
    category: 'Finanzas',
  },

  // Logistics
  LocalShipping: {
    component: LocalShippingIcon,
    label: 'Envío',
    category: 'Logística',
  },
  Inventory: {
    component: InventoryIcon,
    label: 'Inventario',
    category: 'Logística',
  },
  Warehouse: {
    component: WarehouseIcon,
    label: 'Almacén',
    category: 'Logística',
  },

  // Tech & Development
  Settings: {
    component: SettingsIcon,
    label: 'Configuración',
    category: 'Sistema',
  },
  Build: { component: BuildIcon, label: 'Construir', category: 'Sistema' },
  Code: { component: CodeIcon, label: 'Código', category: 'Sistema' },
  Api: { component: ApiIcon, label: 'API', category: 'Sistema' },
  Webhook: { component: WebhookIcon, label: 'Webhook', category: 'Sistema' },
  Storage: {
    component: StorageIcon,
    label: 'Base de datos',
    category: 'Sistema',
  },
  Cloud: { component: CloudIcon, label: 'Nube', category: 'Sistema' },
  CloudUpload: {
    component: CloudUploadIcon,
    label: 'Subir',
    category: 'Sistema',
  },
  CloudDownload: {
    component: CloudDownloadIcon,
    label: 'Descargar',
    category: 'Sistema',
  },
  Sync: { component: SyncIcon, label: 'Sincronizar', category: 'Sistema' },
  Refresh: { component: RefreshIcon, label: 'Actualizar', category: 'Sistema' },

  // Flow & Process
  AccountTree: {
    component: AccountTreeIcon,
    label: 'Árbol',
    category: 'Flujo',
  },
  AltRoute: { component: AltRouteIcon, label: 'Ruta Alt', category: 'Flujo' },
  CallSplit: { component: CallSplitIcon, label: 'Dividir', category: 'Flujo' },
  Merge: { component: MergeIcon, label: 'Fusionar', category: 'Flujo' },
  SwapHoriz: {
    component: SwapHorizIcon,
    label: 'Intercambiar',
    category: 'Flujo',
  },
  Loop: { component: LoopIcon, label: 'Ciclo', category: 'Flujo' },
  Timeline: {
    component: TimelineIcon,
    label: 'Línea tiempo',
    category: 'Flujo',
  },

  // Alerts & Priority
  Warning: {
    component: WarningIcon,
    label: 'Advertencia',
    category: 'Alertas',
  },
  Error: { component: ErrorIcon, label: 'Error', category: 'Alertas' },
  Info: { component: InfoIcon, label: 'Info', category: 'Alertas' },
  Help: { component: HelpIcon, label: 'Ayuda', category: 'Alertas' },
  Report: { component: ReportIcon, label: 'Reporte', category: 'Alertas' },
  Flag: { component: FlagIcon, label: 'Bandera', category: 'Alertas' },
  PriorityHigh: {
    component: PriorityHighIcon,
    label: 'Alta prioridad',
    category: 'Alertas',
  },
  NotificationImportant: {
    component: NotificationImportantIcon,
    label: 'Importante',
    category: 'Alertas',
  },

  // Feedback
  ThumbUp: { component: ThumbUpIcon, label: 'Me gusta', category: 'Feedback' },
  ThumbDown: {
    component: ThumbDownIcon,
    label: 'No me gusta',
    category: 'Feedback',
  },
  Star: { component: StarIcon, label: 'Estrella', category: 'Feedback' },
  Favorite: {
    component: FavoriteIcon,
    label: 'Favorito',
    category: 'Feedback',
  },

  // Time
  CalendarToday: {
    component: CalendarTodayIcon,
    label: 'Calendario',
    category: 'Tiempo',
  },
  Schedule: { component: ScheduleIcon, label: 'Horario', category: 'Tiempo' },

  // Analytics
  BarChart: {
    component: BarChartIcon,
    label: 'Gráfico barras',
    category: 'Análisis',
  },
  PieChart: {
    component: PieChartIcon,
    label: 'Gráfico torta',
    category: 'Análisis',
  },
  TrendingUp: {
    component: TrendingUpIcon,
    label: 'Tendencia +',
    category: 'Análisis',
  },
  TrendingDown: {
    component: TrendingDownIcon,
    label: 'Tendencia -',
    category: 'Análisis',
  },
  Dashboard: {
    component: DashboardIcon,
    label: 'Dashboard',
    category: 'Análisis',
  },

  // Misc
  RocketLaunch: {
    component: RocketLaunchIcon,
    label: 'Lanzar',
    category: 'Misc',
  },
  Celebration: {
    component: CelebrationIcon,
    label: 'Celebrar',
    category: 'Misc',
  },
  EmojiEvents: {
    component: EmojiEventsIcon,
    label: 'Trofeo',
    category: 'Misc',
  },
  Lightbulb: { component: LightbulbIcon, label: 'Idea', category: 'Misc' },
  AutoAwesome: { component: AutoAwesomeIcon, label: 'Magia', category: 'Misc' },
  Bolt: { component: BoltIcon, label: 'Rayo', category: 'Misc' },
  Public: { component: PublicIcon, label: 'Global', category: 'Misc' },
  Home: { component: HomeIcon, label: 'Inicio', category: 'Misc' },
  Business: { component: BusinessIcon, label: 'Empresa', category: 'Misc' },
};

// Get icon names array for iteration
export const ICON_NAMES = Object.keys(ICON_REGISTRY);

// Default icon
export const DEFAULT_ICON = 'AppstoreAddOutlined';

interface IconPickerProps {
  value?: string;
  onChange?: (iconName: string) => void;
  size?: number;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value = DEFAULT_ICON,
  onChange,
  size = 24,
}) => {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedIcon = ICON_REGISTRY[value] || ICON_REGISTRY[DEFAULT_ICON];
  const SelectedIconComponent = selectedIcon.component;

  const filteredIcons = searchTerm
    ? ICON_NAMES.filter(name => {
        const icon = ICON_REGISTRY[name];
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : ICON_NAMES;

  // Group icons by category
  const groupedIcons = filteredIcons.reduce(
    (acc, name) => {
      const category = ICON_REGISTRY[name].category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
    setSearchTerm('');
  };

  const content = (
    <div style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
      <Input
        placeholder="Buscar icono..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 12 }}
        allowClear
      />
      {Object.entries(groupedIcons).map(([category, icons]) => (
        <div key={category} style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: token.colorTextSecondary,
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            {category}
          </div>
          <Flex wrap gap={4}>
            {icons.map(name => {
              const icon = ICON_REGISTRY[name];
              const IconComponent = icon.component;
              const isSelected = name === value;
              return (
                <Tooltip key={name} title={icon.label}>
                  <Button
                    type={isSelected ? 'primary' : 'text'}
                    size="small"
                    onClick={() => handleSelect(name)}
                    style={{
                      width: 36,
                      height: 36,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isSelected
                        ? undefined
                        : `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <IconComponent style={{ fontSize: 18 }} />
                  </Button>
                </Tooltip>
              );
            })}
          </Flex>
        </div>
      ))}
    </div>
  );

  return (
    <Popover
      content={content}
      title="Seleccionar icono"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      <Button
        type="default"
        style={{
          width: size + 16,
          height: size + 16,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: token.borderRadius,
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorPrimary}`,
          boxShadow: token.boxShadow,
          cursor: 'pointer',
        }}
      >
        <SelectedIconComponent
          style={{ fontSize: size, color: token.colorPrimary }}
        />
      </Button>
    </Popover>
  );
};

/**
 * Renders an icon by name from the registry.
 * Falls back to default if not found.
 */
export const NodeIcon: React.FC<{
  name?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name = DEFAULT_ICON, size = 20, color, style }) => {
  const iconEntry = ICON_REGISTRY[name] || ICON_REGISTRY[DEFAULT_ICON];
  const IconComponent = iconEntry.component;
  return <IconComponent style={{ fontSize: size, color, ...style }} />;
};
