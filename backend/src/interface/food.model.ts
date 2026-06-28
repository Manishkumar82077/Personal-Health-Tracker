export type Micros = Record<string, number>;

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros?: Micros;
}

export interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros?: Micros;
  date: string;
  mealId?: string;       // set if logged from a saved meal
  foodItemId?: string;   // set if logged from a library food item
  createdAt: string;
}
