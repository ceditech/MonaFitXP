// Must be `babel-preset-expo`, NOT `module:@react-native/babel-preset`.
//
// This project was originally scaffolded as a plain React Native app and kept
// the bare RN preset. Expo's preset is what correctly compiles Expo's `winter`
// runtime polyfills (which bundle web-streams-polyfill). With the RN preset
// those polyfills were transpiled with @babel/runtime helper imports, emitting a
// bare `require()` into the Metro prelude — where `require` does not yet exist —
// so every native launch died at startup with:
//   ReferenceError: Property 'require' doesn't exist
//   Non-js exception: AppRegistryBinding::startSurface failed. Global was not installed.
// Web was unaffected because those polyfills are native-focused, which is why
// this went unnoticed until the first Android smoke test.
//
// babel-preset-expo includes the React Native preset internally, so nothing is lost.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
