
// app/src/data/contracts/IWorkoutRepository.ts

export interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  type: 'weight' | 'cardio' | 'bodyweight';
  equipment: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
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

  // Notification Preferences
  notificationPrefs?: {
    remindersEnabled: boolean;
    reminderTime: string; // "HH:mm"
    reminderDays: string[]; // ["Mon", "Tue", ...]
  };

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

export interface UserPlan {
  id: string;
  templateId: string;
  scheduleDays: string[]; // ['Mon', 'Wed', 'Fri']
  createdAt: string;
  active: boolean;
}

export interface WorkoutSessionSet {
  exerciseId: string;
  setIndex: number;
  targetReps: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  rpe?: number;
  completedAt?: string;
}

export interface InProgressWorkout {
  id: string;
  planId?: string;
  name: string;
  startedAt: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  cursor: {
    exerciseIndex: number;
    setIndex: number;
  };
  sets: WorkoutSessionSet[];
  pausedElapsedSeconds?: number; // When paused, stores the elapsed time
}

export interface PersonalRecord {
  exerciseId: string;
  bestWeight?: number;
  bestReps?: number;
  achievedAt: string;
}

export interface UserMetrics {
  streakDays: number;
  workoutsThisWeek: number;
  weeklyVolume: number;
  prs: PersonalRecord[];
  volumeHistory?: { date: string, volume: number }[];
}

export interface IWorkoutRepository {
  // Catalogs
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | null>;
  getPlanTemplates(): Promise<PlanTemplate[]>;
  getPlanTemplate(id: string): Promise<PlanTemplate | null>;

  // User Data
  getUserProfile(uid: string): Promise<UserProfile | null>;
  saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void>;

  // Plans
  getActivePlan(uid: string): Promise<UserPlan | null>;
  createUserPlan(uid: string, plan: Omit<UserPlan, 'id'>): Promise<string>;
  activatePlan(uid: string, planId: string): Promise<void>;
  saveActivePlan(uid: string, plan: any): Promise<void>;

  // Workout Execution
  startWorkout(uid: string, workout: Omit<InProgressWorkout, 'id'>): Promise<string>;
  getInProgressWorkout(uid: string): Promise<InProgressWorkout | null>;
  updateInProgressWorkout(uid: string, workout: InProgressWorkout): Promise<void>;
  logSet(uid: string, workoutId: string, set: WorkoutSessionSet): Promise<void>;
  updateWorkoutCursor(uid: string, workoutId: string, cursor: { exerciseIndex: number; setIndex: number }): Promise<void>;
  completeWorkout(uid: string, workoutId: string): Promise<void>;
  abandonWorkout(uid: string, workoutId: string): Promise<void>;

  // History
  getHistory(uid: string): Promise<WorkoutLog[]>;
  listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]>;
  getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null>;
  listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]>;
  saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void>;

  // Metrics
  getMetrics(uid: string): Promise<UserMetrics>;
}
