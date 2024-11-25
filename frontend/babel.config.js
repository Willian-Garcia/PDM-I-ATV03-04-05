module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    ["@babel/plugin-transform-private-methods", { loose: true }], // Adicione o modo 'loose'
    ["@babel/plugin-transform-class-properties", { loose: true }], // Adicione o modo 'loose'
    ["@babel/plugin-transform-private-property-in-object", { loose: true }], // Adicione o modo 'loose'
  ],
};
