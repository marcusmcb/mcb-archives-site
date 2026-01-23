import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({ baseDirectory: import.meta.url });

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals")
];
