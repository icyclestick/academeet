const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro'); // Keep this if you use NativeWind

const config = getDefaultConfig(__dirname);

// This flag is CRUCIAL and came from the GitHub issue.
// It fixes the 'stream' and 'events' module errors.
config.resolver.unstable_enablePackageExports = false;

// This block adds the polyfill for the 'https' module,
// which is needed specifically on Android even with the above flag.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules, // Preserve any existing extraNodeModules
  https: require.resolve('https-browserify'), // This line polyfills 'https'
};

module.exports = withNativeWind(config, { input: './app/globals.css' });