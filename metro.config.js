const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// --- Fix stream/events error ---
config.resolver.unstable_enablePackageExports = false;

// --- Polyfill for 'https' module on Android ---
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  https: require.resolve("https-browserify"),
};

// --- SVG support using react-native-svg-transformer ---
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

// --- Wrap with NativeWind ---
module.exports = withNativeWind(config, { input: "./app/globals.css" });
