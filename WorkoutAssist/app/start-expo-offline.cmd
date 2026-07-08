@echo off
set CI=1
set EXPO_NO_TELEMETRY=1
"C:\Users\CedricYovodevi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\expo\bin\cli" start --web --offline > ".\expo-dev.log" 2>&1
