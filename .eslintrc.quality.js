module.exports = {
  extends: [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",

    // Code quality rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",

    // Best practices
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "dot-notation": "error",
    "no-else-return": "error",
    "no-empty-function": "warn",
    "no-magic-numbers": ["warn", { ignore: [0, 1, -1] }],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
    "no-trailing-spaces": "error",

    // React specific
    "react/jsx-no-target-blank": "error",
    "react/jsx-key": "error",
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-unsafe": "error",

    // Next.js specific
    "@next/next/no-img-element": "warn",
    "@next/next/no-html-link-for-pages": "error",

    // Accessibility
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
  },
  overrides: [
    {
      files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-magic-numbers": "off",
      },
    },
    {
      files: ["scripts/**/*.js"],
      rules: {
        "no-console": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
