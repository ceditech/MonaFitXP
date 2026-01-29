# Schema Mapping - WorkoutPlayerScreen (P0.5)

## Data Model Extensions

### InProgressWorkout
Added optional field for persistence:
- `pausedElapsedSeconds?: number` - Stores elapsed time when workout is "Ended" but not "Finished".

### Workout History (Detailed)
Added storage for detailed session recap:
- `WA_DATA_${uid}_history_details` - Map of `workoutId` to completed `InProgressWorkout` objects.
- Enables granular recap in `WorkoutSummaryScreen`.
