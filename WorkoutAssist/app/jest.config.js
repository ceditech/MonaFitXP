module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  // *.manual.* files are runnable scripts (they call process.exit), not jest suites.
  testPathIgnorePatterns: ['/node_modules/', '\\.manual\\.'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|expo(nent)?|@expo(nent)?/.*|expo-.*|three|gsap|lucide-react-native|uuid|firebase|@firebase)/)',
  ],
};
