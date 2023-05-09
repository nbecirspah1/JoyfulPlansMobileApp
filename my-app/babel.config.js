module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      require.resolve("expo-router/babel"),
      "react-native-reanimated/plugin"
    ],
  };
};
