export interface FoodItem {
  id: string;
  name: string;
  nameLower: string;       // lowercased name for search/prefix queries
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  defaultQuantity: number; // grams in one serving, e.g. roti = 50
  usageCount: number;      // how many times logged — used to rank search
  lastUsedAt?: string;     // ISO 8601, set when logged
  createdAt: string;
  updatedAt: string;
}

export type FoodItemInput = Omit<
  FoodItem,
  'id' | 'nameLower' | 'usageCount' | 'lastUsedAt' | 'createdAt' | 'updatedAt'
>;
