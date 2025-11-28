export interface User {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  healthConditions: string;
  createdAt: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  timing: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface HealthGoals {
  userId: string;
  dailyCalories: number;
  exerciseMinutes: number;
  waterIntake: number;
  medicines: Medicine[];
  createdAt: string;
}

export interface DayPlan {
  day: string;
  exercise: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  medicines: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
  };
  hydration: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  tips: string[];
}

export interface WeeklyPlan {
  userId: string;
  days: DayPlan[];
  generatedAt: string;
}
