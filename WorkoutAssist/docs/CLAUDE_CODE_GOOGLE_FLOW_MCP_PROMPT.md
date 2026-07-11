# Claude Code Prompt — Google Flow MCP Exercise Asset Pipeline for WorkoutAssist

You are working inside the WorkoutAssist / MonaFitXP React Native Expo app.

## Objective

Use the Google Flow Batch Prompt Pack to generate 3D exercise image assets for all 35 exercises and integrate them into the app in a robust, maintainable, production-friendly way.

## Inputs

Place these files in the repo:

1. Markdown reference:
   - `docs/WORKOUTASSIST_GOOGLE_FLOW_BATCH_PROMPT_PACK.md`

2. TypeScript prompt source:
   - `app/src/data/prompts/googleFlowExercisePromptPack.ts`

The TypeScript pack exports:

- `GOOGLE_FLOW_EXERCISE_PROMPTS`
- `getAllGoogleFlowJobs()`
- `getPromptByExerciseId(exerciseId, assetType)`

The prompt pack contains:

- 35 exercises
- 105 prompts
- storyboard, hero, and muscleCloseup prompts per exercise

## Constraints

- Do not hard-code credentials.
- Do not commit secrets, OAuth tokens, API keys, service account files, or local MCP credentials.
- Use the configured Google Flow MCP server/tool if available.
- If Google Flow MCP is not configured, implement a dry-run provider and fail clearly for real generation.
- Existing procedural Three.js / GSAP / expo-gl animations must remain functional.
- Generated assets must enhance the app, not break fallbacks.
- The app must work even when generated images are missing.

## Implementation steps

1. Inspect current app structure:
   - exercise catalog seed data
   - media registry
   - animation registry
   - Exercise Detail screen
   - Workout Player screen
   - asset folders
   - existing scripts/package scripts

2. Place prompt files:
   - Markdown into `docs/`
   - TypeScript into `app/src/data/prompts/`

3. Create a script:
   - `app/scripts/generate-exercise-assets-with-google-flow.ts`

The script must:

- import `getAllGoogleFlowJobs()`
- iterate through all 105 jobs
- support `--dry-run`
- support `--force`
- skip existing files unless forced
- save generated images to:
  `app/assets/exercises/generated-3d/<exercise-slug>/<outputFile>`
- create/update:
  `app/assets/exercises/generated-3d/manifest.json`

Manifest shape:

```json
{
  "generatedAt": "ISO_DATE",
  "provider": "google-flow",
  "exerciseCount": 35,
  "assetCount": 105,
  "items": [
    {
      "exerciseId": "ex_001",
      "slug": "barbell-squat",
      "assetType": "storyboard",
      "path": "assets/exercises/generated-3d/barbell-squat/ex_001_barbell-squat_storyboard_v1.png",
      "promptHash": "..."
    }
  ]
}
```

4. Create an image generation provider interface:

```ts
interface ImageGenerationProvider {
  generateImage(params: {
    prompt: string;
    aspectRatio: "9:16";
    quality: "high";
    outputPath: string;
  }): Promise<{ outputPath: string; providerJobId?: string }>;
}
```

Implement:

- `GoogleFlowMcpProvider` when MCP is configured
- `DryRunProvider` for dry-run and validation

5. Integrate generated assets:

- Create a media resolver such as:
  `getExerciseGeneratedMedia(exerciseId)`
- Use hero images in Exercise Detail if available
- Use storyboard images in How-to-Perform section if available
- Use muscleCloseup images in muscle education cards if available
- Keep existing procedural animations and SVG fallbacks

6. Create delivery artifacts:
   `docs/delivery/artifacts/epic-06-exercise-media/mission-06-01-google-flow-asset-generation/`

Files:

- `README.md`
- `implementation-notes.md`
- `google-flow-mcp-runbook.md`
- `asset-manifest-contract.md`
- `qa-checklist.md`
- `rollback.md`

7. Verification:

- Run dry-run
- Verify output paths for at least 3 exercises:
  - Barbell Squat
  - Bicep Curl
  - Hip Thrust or Romanian Deadlift
- Run app web preview
- Verify missing generated images do not crash UI
- Verify native path remains safe

## Git commit instructions

```bash
git status

git add docs/WORKOUTASSIST_GOOGLE_FLOW_BATCH_PROMPT_PACK.md app/src/data/prompts/googleFlowExercisePromptPack.ts
git commit -m "feat(media): add Google Flow exercise prompt pack"

git add app/scripts app/assets/exercises/generated-3d
git commit -m "feat(media): add Google Flow exercise asset generation pipeline"

git add app/src
git commit -m "feat(exercises): integrate generated 3D assets into exercise experience"

git add docs/delivery/artifacts/epic-06-exercise-media/mission-06-01-google-flow-asset-generation
git commit -m "docs(delivery): add Google Flow asset generation artifacts"
```

## Final output required

Return:

1. What changed
2. Exact files created/modified
3. How to run dry-run
4. How to run actual Google Flow generation through MCP
5. Where generated images are saved
6. How the app consumes generated assets
7. Verification checklist
8. Known limitations and next steps
