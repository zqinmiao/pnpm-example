import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default defineConfig([
  // browser-friendly UMD build
  {
    input: "src/index.js",
    output: {
      name: "fooRollup",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [resolve(), commonjs()],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [resolve(), commonjs()],
  },
]);
