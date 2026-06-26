import { MacroTotals } from './food.model';

export interface MealItem {
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  quantity: number;
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  totals: MacroTotals;
  createdAt: string;
  updatedAt: string;
}
