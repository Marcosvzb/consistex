import { 
  Droplet, 
  Book, 
  Dumbbell, 
  Moon, 
  Sun, 
  Bike, 
  Coffee, 
  Code, 
  Heart, 
  Zap, 
  Brain, 
  CheckCircle2,
  Apple,
  Utensils,
  Flame,
  Target,
  Medal,
  Timer,
  Gamepad2,
  Music,
  Camera,
  Languages,
  BookOpen,
  GraduationCap,
  Briefcase,
  Monitor,
  PenTool,
  Wind,
  Smile,
  Leaf,
  Stethoscope,
  Pill,
  ShowerHead,
  Footprints
} from 'lucide-react';

export const CATEGORIAS_ICONES = [
  { id: 'saude', label: 'Saúde', icones: ['heart', 'stethoscope', 'pill', 'shower', 'footprints', 'droplet'] },
  { id: 'estudo', label: 'Estudo', icones: ['book', 'bookOpen', 'graduation', 'languages', 'pen'] },
  { id: 'fitness', label: 'Fitness', icones: ['gym', 'bike', 'flame', 'medal', 'target', 'timer'] },
  { id: 'mindfulness', label: 'Mindfulness', icones: ['brain', 'wind', 'smile', 'leaf', 'moon', 'sun'] },
  { id: 'alimentacao', label: 'Alimentação', icones: ['apple', 'utensils', 'coffee'] },
  { id: 'produtividade', label: 'Produtividade', icones: ['zap', 'code', 'briefcase', 'monitor', 'music', 'camera', 'gamepad'] },
];

export const ICONES_HABITO = {
  // Saude
  heart: Heart,
  stethoscope: Stethoscope,
  pill: Pill,
  shower: ShowerHead,
  footprints: Footprints,
  droplet: Droplet,
  // Estudo
  book: Book,
  bookOpen: BookOpen,
  graduation: GraduationCap,
  languages: Languages,
  pen: PenTool,
  // Fitness
  gym: Dumbbell,
  bike: Bike,
  flame: Flame,
  medal: Medal,
  target: Target,
  timer: Timer,
  // Mindfulness
  brain: Brain,
  wind: Wind,
  smile: Smile,
  leaf: Leaf,
  moon: Moon,
  sun: Sun,
  // Alimentação
  apple: Apple,
  utensils: Utensils,
  coffee: Coffee,
  // Produtividade
  zap: Zap,
  code: Code,
  briefcase: Briefcase,
  monitor: Monitor,
  music: Music,
  camera: Camera,
  gamepad: Gamepad2,
  // Default
  default: CheckCircle2,
} as const;

export type IconeHabitoType = keyof typeof ICONES_HABITO;

export const OBTER_ICONE = (nome: string) => {
  return ICONES_HABITO[nome as IconeHabitoType] || ICONES_HABITO.default;
};
