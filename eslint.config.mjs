import deprecation from "eslint-plugin-deprecation";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "next/core-web-vitals"), {
    plugins: {
        deprecation,
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        globals: {},
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@next/next/no-img-element": "off",
        "deprecation/deprecation": "warn",
        "no-unused-vars": "warn",
        "no-extra-semi": "warn",
        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
    },
}];