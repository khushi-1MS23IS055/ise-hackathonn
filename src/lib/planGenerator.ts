import { HealthGoals, DayPlan, WeeklyPlan, Medicine } from '@/types/health';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const exerciseOptions: Record<string, string[]> = {
  light: [
    '20 min gentle walk + 10 min stretching',
    '15 min yoga flow + 10 min meditation',
    '20 min slow cycling + light stretches',
    '15 min swimming + water exercises',
    '25 min tai chi session',
    '20 min nature walk + breathing exercises',
    'Rest day - light stretching only',
  ],
  moderate: [
    '30 min brisk walk + 15 min core workout',
    '25 min HIIT cardio + 10 min stretching',
    '30 min home strength training',
    '35 min cycling + 10 min cool down',
    '30 min dance workout + stretching',
    '25 min jogging + 15 min yoga',
    '40 min swimming + light cardio',
  ],
  intense: [
    '45 min running + 15 min strength',
    '50 min CrossFit style workout',
    '40 min weight training + 20 min cardio',
    '60 min cycling + hill intervals',
    '45 min boxing workout + core',
    '50 min circuit training',
    '30 min active recovery + mobility',
  ],
};

const mealSuggestions = {
  breakfast: [
    'Oatmeal with berries, nuts & honey',
    'Greek yogurt parfait with granola',
    'Avocado toast with poached eggs',
    'Smoothie bowl with fruits & seeds',
    'Whole grain pancakes with fruit',
    'Veggie omelette with whole wheat toast',
    'Chia pudding with mango',
  ],
  lunch: [
    'Grilled chicken salad with quinoa',
    'Mediterranean wrap with hummus',
    'Buddha bowl with roasted vegetables',
    'Salmon with brown rice & greens',
    'Turkey sandwich on whole grain',
    'Lentil soup with mixed salad',
    'Stir-fried tofu with vegetables',
  ],
  dinner: [
    'Baked fish with roasted vegetables',
    'Lean beef stir-fry with brown rice',
    'Grilled chicken with sweet potato',
    'Vegetable curry with basmati rice',
    'Pasta primavera with olive oil',
    'Turkey meatballs with zucchini noodles',
    'Stuffed bell peppers with quinoa',
  ],
};

const healthTips = [
  'Get 7-8 hours of quality sleep tonight.',
  'Take short breaks every hour if working at a desk.',
  'Practice deep breathing for 5 minutes today.',
  'Add more leafy greens to your meals.',
  'Limit screen time 1 hour before bed.',
  'Take a 10-minute walk after lunch.',
  'Stay consistent with your medicine schedule.',
  'Choose whole foods over processed options.',
  'Listen to your body and rest when needed.',
  'Keep healthy snacks handy to avoid junk food.',
  'Stretch for 5 minutes every morning.',
  'Stay positive - mental health matters too!',
  'Track your progress to stay motivated.',
  'Meal prep on weekends to save time.',
];

function getExerciseIntensity(minutes: number): 'light' | 'moderate' | 'intense' {
  if (minutes <= 25) return 'light';
  if (minutes <= 40) return 'moderate';
  return 'intense';
}

function generateMeals(calorieTarget: number, dayIndex: number) {
  const breakfastCals = Math.round(calorieTarget * 0.3);
  const lunchCals = Math.round(calorieTarget * 0.4);
  const dinnerCals = Math.round(calorieTarget * 0.3);

  return {
    breakfast: `${mealSuggestions.breakfast[dayIndex]} (~${breakfastCals} cal)`,
    lunch: `${mealSuggestions.lunch[dayIndex]} (~${lunchCals} cal)`,
    dinner: `${mealSuggestions.dinner[dayIndex]} (~${dinnerCals} cal)`,
  };
}

function generateHydration(waterIntake: number) {
  const morningWater = (waterIntake * 0.35).toFixed(1);
  const afternoonWater = (waterIntake * 0.4).toFixed(1);
  const eveningWater = (waterIntake * 0.25).toFixed(1);

  return {
    morning: `${morningWater}L - 2 glasses with breakfast, 1-2 mid-morning`,
    afternoon: `${afternoonWater}L - Before & after lunch, during exercise`,
    evening: `${eveningWater}L - With dinner, avoid excess before bed`,
  };
}

function groupMedicinesByTiming(medicines: Medicine[]) {
  const grouped = {
    morning: [] as string[],
    afternoon: [] as string[],
    evening: [] as string[],
    night: [] as string[],
  };

  medicines.forEach(med => {
    const entry = `${med.name} (${med.dosage})`;
    grouped[med.timing].push(entry);
  });

  return grouped;
}

function getRandomTips(count: number): string[] {
  const shuffled = [...healthTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateWeeklyPlan(goals: HealthGoals): WeeklyPlan {
  const intensity = getExerciseIntensity(goals.exerciseMinutes);
  const exercises = exerciseOptions[intensity];
  const medicineSchedule = groupMedicinesByTiming(goals.medicines);

  const days: DayPlan[] = DAYS.map((day, index) => ({
    day,
    exercise: exercises[index],
    meals: generateMeals(goals.dailyCalories, index),
    medicines: medicineSchedule,
    hydration: generateHydration(goals.waterIntake),
    tips: getRandomTips(2),
  }));

  return {
    userId: goals.userId,
    days,
    generatedAt: new Date().toISOString(),
  };
}
