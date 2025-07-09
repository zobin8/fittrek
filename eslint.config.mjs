import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores(["db", "**/*.min.js"]),
  {
    files: ["public/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
]);
