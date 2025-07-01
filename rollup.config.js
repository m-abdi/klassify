import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  // JS Bundles
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/klassify.esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/klassify.umd.js",
        format: "umd",
        name: "Klassify", // Global var name in browsers (window.Klassify)
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },

  // Type Declarations
  {
    input: "src/index.ts",
    output: {
      file: "dist/klassify.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
