import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores(["db", "**/*.min.js"]),
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["public/**/*.js"],
    plugins: { js },
    languageOptions: {
      sourceType: "script",
      globals: {...globals.browser, ...globals.jquery }, 
    }
  },
]);
