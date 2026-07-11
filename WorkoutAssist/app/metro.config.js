const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bundle 3D model assets so exercise demos can load rigged animations
// (GLB skinned meshes + animation clips). `.bin` covers external-buffer glTF.
config.resolver.assetExts = Array.from(
  new Set([...config.resolver.assetExts, 'glb', 'gltf', 'bin']),
);

module.exports = config;
