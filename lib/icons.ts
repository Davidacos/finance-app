import {
  Home, Briefcase, Building, Car, Coffee, Dog, Plane, 
  ShoppingCart, Smartphone, Tv, Utensils, Zap, HeartPulse, GraduationCap, 
  Dumbbell, Gift, PiggyBank, Receipt, Shirt, Train, Ticket, Wallet
} from "lucide-react";

/**
 * Common Lucide Icons mapped for easy dynamic frontend rendering
 * Note: The string keys should exactly match the string saved in the Database
 */
export const CATEGORY_ICONS_MAP: Record<string, React.FC<any>> = {
  home: Home,
  briefcase: Briefcase,
  building: Building,
  car: Car,
  coffee: Coffee,
  dog: Dog,
  plane: Plane,
  'shopping-cart': ShoppingCart,
  smartphone: Smartphone,
  tv: Tv,
  utensils: Utensils,
  zap: Zap,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  dumbbell: Dumbbell,
  gift: Gift,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
  shirt: Shirt,
  train: Train,
  ticket: Ticket,
  wallet: Wallet,
};

// Available icons to be displayed in the Icon Picker
export const AVAILABLE_CATEGORY_ICONS = Object.keys(CATEGORY_ICONS_MAP);
