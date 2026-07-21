
// app/src/data/contracts/IWorkoutRepository.ts

export interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  type: 'weight' | 'cardio' | 'bodyweight';
  equipment: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  /** One-line coaching cue shown as a highlighted "Pro Tip" callout. */
  formTip?: string;

  // Rich-catalog fields (all optional — legacy docs need no migration)
  media?: {
    thumbnailUrl?: string;
    videoUrl?: string;
    /** Key of a future 3D form-demo animation clip. */
    animationKey?: string;
  };
  primaryMuscleGroup?: string;
  muscleDiagram?: { primary: string[]; secondary: string[] };
  isCustom?: boolean;
  ownerUid?: string;
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
  /**
   * Which training goal this template serves. Optional because no seeded
   * template carries it yet — onboarding's template selection falls back to
   * difficulty/schedule/equipment until they do. See selectPlanTemplate.ts.
   */
  goal?: 'strength' | 'hypertrophy' | 'fat_loss' | 'mobility';
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
  /**
   * Set when the user pressed "Skip". Distinct from onboardingCompleted so the
   * wizard can be re-offered later without being forced on every launch, and so
   * skippers stay distinguishable from finishers in analytics.
   */
  onboardingSkippedAt?: string;

  // Notification Preferences
  notificationPrefs?: {
    remindersEnabled: boolean;
    reminderTime: string; // "HH:mm"
    reminderDays: string[]; // ["Mon", "Tue", ...]
  };

  // Favorited exercise ids (catalog or custom_-prefixed)
  favoriteExerciseIds?: string[];

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

export interface XpAwardRecord {
  workoutId: string;
  xp: number;
  breakdown: { base: number; sets: number; volume: number; prs: number; streak: number };
  newBadgeIds?: string[];
  at?: any; // Firestore Timestamp
}

/** Server-written doc at users/{uid}/metrics/gamification (client read-only). */
export interface GamificationState {
  totalXp: number;
  level: number;
  lifetimeWorkouts: number;
  lifetimeVolume: number;
  lifetimeSets: number;
  lifetimePrs: number;
  badges: Record<string, { earnedAt: any }>;
  lastAward?: XpAwardRecord;
}

export interface IWorkoutRepository {
  // Catalogs
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | null>;
  /** Catalog + the user's custom exercises merged (custom ids are `custom_`-prefixed). */
  getMergedExercises(uid: string): Promise<Exercise[]>;

  // Custom exercises & favorites
  listCustomExercises(uid: string): Promise<Exercise[]>;
  createCustomExercise(uid: string, exercise: Omit<Exercise, 'id' | 'isCustom' | 'ownerUid'>): Promise<string>;
  deleteCustomExercise(uid: string, exerciseId: string): Promise<void>;
  getFavoriteExerciseIds(uid: string): Promise<string[]>;
  toggleFavorite(uid: string, exerciseId: string): Promise<string[]>;
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
  /**
   * The logged sets for `exerciseId` from the most recent completed workout
   * that contains it, or null when the user has never performed it.
   */
  getLastExercisePerformance(uid: string, exerciseId: string): Promise<WorkoutSessionSet[] | null>;
  /**
   * All logged sets for `exerciseId` across recent completed workouts
   * (bounded by maxWorkouts, newest first). Used for e1RM timelines.
   */
  getExerciseSetHistory(uid: string, exerciseId: string, maxWorkouts?: number): Promise<WorkoutSessionSet[]>;
  listWorkouts(uid: string, options?: { status?: string; limit?: number }): Promise<InProgressWorkout[]>;
  getWorkout(uid: string, workoutId: string): Promise<InProgressWorkout | null>;
  listWorkoutSets(uid: string, workoutId: string): Promise<WorkoutSessionSet[]>;
  saveWorkoutSession(uid: string, session: WorkoutLog): Promise<void>;

  // Metrics & Entitlements
  getMetrics(uid: string): Promise<UserMetrics>;
  getGamification(uid: string): Promise<GamificationState | null>;
  getEntitlement(uid: string): Promise<{ tier: string }>;
}
