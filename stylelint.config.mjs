const config = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: ["stylelint-order"],
  rules: {
    "import-notation": null,
    // Tailwind directives
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",

          "layer", 





          

          "config",
          "variants",
          "responsive",
          "screen",
          "theme",
          "custom-variant",
        ],
      },
    ],
  },
  ignoreFiles: ["**/.next/**", "**/node_modules/**"],
};

export default config;
