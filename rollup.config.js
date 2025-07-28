import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

export default [
  // JS Bundles
  {
    input: { main: "src/main.ts", worker: "src/worker.ts" },
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: false,
        entryFileNames: ({ name }) => {
          if (name === "worker") return "klassify.worker.js";
          if (name === "main") return "klassify.js";
          return "[name].js"; // fallback
        },
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      copy({
        targets: [
          { src: "models/trained/*.ftz", dest: "dist/models" },
          {
            src: "src/core/entities/models/fasttext/ft_wasm.wasm",
            dest: "dist/",
          },
        ],
      }),
    ],
  },

  // Type Declarations
  {
    input: "src/main.ts",
    output: {
      file: "dist/klassify.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
  {
    input: "src/worker.ts",
    output: {
      file: "dist/klassify.worker.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
