
// app/src/data/contracts/IWorkoutRepository.ts

export interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  type: 'weight' | 'cardio' | 'bodyweight';
  equipment: string;
}

export interface PlanTemplateBlock {
  exerciseId: string;
  sets: number;
  reps: number;
}

export interface PlanTemplate {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  isPremium: boolean;
  shortDescription: string;
  equipment: string[];
  blocks: PlanTemplateBlock[];
}

export interface UserProfile {
  uid: string;
  isGuest: boolean;
  name?: string;
  preferences?: Record<string, any>;
  createdAt: string;

  // Onboarding Fields
  goal?: 'strength' | 'hypertrophy' | 'fat_loss' | 'mobility';
  experience?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string[];
  daysPerWeek?: number;
  preferredDays?: string[];
  injuryFlags?: string[];
  sessionMinutes?: number;
  timezone?: string;
  onboardingCompleted?: boolean;
  updatedAt?: string;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  templateId?: string;
  durationSeconds: number;
  totalVolume: number;
}

export interface IWorkoutRepository {
  // Catalogs
  getExercises(): Promise<Exercise[]>;
  getPlanTemplates(): Promise<PlanTemplate[]>;
  getPlanTemplate(id: string): Promise<PlanTemplate | null>;

  // User Data
  getUserProfile(uid: string): Promise<UserProfile | null>;
  saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void>;

  // Plans
  getActivePlan(uid: string): Promise<any | null>; // Simplify for now
  saveActivePlan(uid: string, plan: any): Promise<void>;

  // Workout Execution
  getHistory(uid: string): Promise<WorkoutLog[]>;
  saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void>;

  // Metrics
  getMetrics(uid: string): Promise<any>;
}
