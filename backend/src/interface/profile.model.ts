export interface Goals {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  fiberGoal: number;
  waterGoalMl: number;
  stepGoal: number;
  sleepGoalHours: number;
}

export interface Profile {
  uid: string;
  email: string;
  displayName?: string;
  weightKg?: number;
  goals: Goals;
  createdAt: string;
  updatedAt: string;
}
