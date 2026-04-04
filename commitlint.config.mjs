export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\S+\s\w+)(?:\(([^)]+)\))?:\s(.+)$/u,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },

  rules: {
    "type-enum": [
      2,
      "always",
      ["🚀 feat", "⚠️ fix", "🔧 chore", "♻️ refactor", "🧪 test", "📝 docs"],
    ],
    "scope-empty": [0],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};
