// eslint.config.js
import js from "@eslint/js"
import astro from "eslint-plugin-astro"
import astroParser from "astro-eslint-parser"
import prettier from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import jsonc from "jsonc-eslint-parser"

export default [
	{
		ignores: [
			"node_modules",
			"dist",
			".astro",
			"coverage",
			"eslint.config.js",
			"vite.config.*",
			"tailwind.config.*",
			"postcss.config.*",
		],
	},
	js.configs.recommended,
	...astro.configs.recommended,
	prettier,
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				parser: tsparser,
				extraFileExtensions: [".astro"],
			},
		},
		plugins: {
			astro,
		},
		rules: {
			...astro.configs.recommended[0].rules,
			"prettier/prettier": "off", // <--- Desactivar para evitar el bug
		},
	},
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsparser,
			ecmaVersion: "latest",
			sourceType: "module",
		},
		plugins: {
			prettier: prettierPlugin,
			"@typescript-eslint": tseslint,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			"prettier/prettier": "error",
		},
	},
	{
		files: ["**/*.json"],
		languageOptions: {
			parser: jsonc,
		},
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
	{
		files: ["**/*.{ts,tsx,js,jsx,astro}"],
		languageOptions: {
			globals: {
				window: true,
				document: true,
				navigator: true,
				Blob: true,
				FormData: true,
				HTMLFormElement: true,
				fetch: true,
				alert: true,
				setTimeout: true,
				console: true,
				Element: true,
			},
		},
	},
	{
		files: ["**/*.{ts,tsx,astro}"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
]
