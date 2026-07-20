// Sentry's wrapper around expo's default Metro config: annotates bundles
// with debug IDs so stack traces can symbolicate. Behaves identically to
// `getDefaultConfig` otherwise.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Bundle 3D model assets so exercise demos can load rigged animations
// (GLB skinned meshes + animation clips). `.bin` covers external-buffer glTF.
config.resolver.assetExts = Array.from(
  new Set([...config.resolver.assetExts, 'glb', 'gltf', 'bin']),
);

module.exports = config;
