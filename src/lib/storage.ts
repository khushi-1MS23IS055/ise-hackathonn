// Replace or merge with your existing src/lib/storage.ts
// Adds authenticateUser(username, password) for the Login page.
// Keeps original localStorage behavior.

import { User, HealthGoals, WeeklyPlan } from '@/types/health';

const USERS_KEY = 'health_planner_users';
const GOALS_KEY = 'health_planner_goals';
const PLANS_KEY = 'health_planner_plans';

// User storage functions
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getUser = (userId: string): User | null => {
  const users = getUsers();
  return users.find(u => u.id === userId) || null;
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Also delete associated goals and plans
  deleteGoals(userId);
  deletePlan(userId);
};

// Authentication (minimal, client-side)
export const authenticateUser = (username: string, password: string): User | null => {
  // Here we treat 'username' as the user's name (same field used in Register).
  // If you prefer another username field, add it to the User type and form.
  const users = getUsers();
  const found = users.find(u => u.name === username && u.password === password);
  return found || null;
};

/* Goals */
export const getAllGoals = (): HealthGoals[] => {
  const data = localStorage.getItem(GOALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getGoals = (userId: string): HealthGoals | null => {
  const allGoals = getAllGoals();
  return allGoals.find(g => g.userId === userId) || null;
};

export const saveGoals = (goals: HealthGoals): void => {
  const allGoals = getAllGoals();
  const existingIndex = allGoals.findIndex(g => g.userId === goals.userId);
  if (existingIndex >= 0) {
    allGoals[existingIndex] = goals;
  } else {
    allGoals.push(goals);
  }
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
};

export const deleteGoals = (userId: string): void => {
  const allGoals = getAllGoals().filter(g => g.userId !== userId);
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
};

/* Plans */
export const getAllPlans = (): WeeklyPlan[] => {
  const data = localStorage.getItem(PLANS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPlan = (userId: string): WeeklyPlan | null => {
  const allPlans = getAllPlans();
  return allPlans.find(p => p.userId === userId) || null;
};

export const savePlan = (plan: WeeklyPlan): void => {
  const allPlans = getAllPlans();
  const existingIndex = allPlans.findIndex(p => p.userId === plan.userId);
  if (existingIndex >= 0) {
    allPlans[existingIndex] = plan;
  } else {
    allPlans.push(plan);
  }
  localStorage.setItem(PLANS_KEY, JSON.stringify(allPlans));
};

export const deletePlan = (userId: string): void => {
  const allPlans = getAllPlans().filter(p => p.userId !== userId);
  localStorage.setItem(PLANS_KEY, JSON.stringify(allPlans));
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};