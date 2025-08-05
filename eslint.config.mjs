import deprecation from "eslint-plugin-deprecation";
import reactCompiler from "eslint-plugin-react-compiler";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...pluginQuery.configs["flat/recommended"],
    ...compat.extends("eslint:recommended", "next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            deprecation,
            "react-compiler": reactCompiler,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@next/next/no-img-element": "off",
            // "deprecation/deprecation": "warn",
            "no-unused-vars": [
                "warn",
                {
                  "argsIgnorePattern": "^_",
                  "varsIgnorePattern": "^_",
                  "caughtErrorsIgnorePattern": "^_"
                }
            ],
            "no-extra-semi": "warn",
            "react-compiler/react-compiler": "error",
            "quotes": ["warn", "double"],
            "react/jsx-no-literals": "error",
            "simple-import-sort/imports": [
                "error",
                {
                  "groups": [
                    ["^\\u0000"],
                    ["^react$", "^@?\\w"],
                    ["^@", "^"],
                    ["^\\./"],
                    ["^.+\\.(module.css|module.scss)$"],
                    ["^.+\\.(gif|png|svg|jpg)$"]
                  ]
                }
            ]
        },
    }
];