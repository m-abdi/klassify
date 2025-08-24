import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

export default [
  // JS Bundles
  {
    input: { klassify: "src/klassify.ts", worker: "src/worker.ts" },
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: false,
        entryFileNames: ({ name }) => {
          if (name === "worker") return "klassify.worker.js";
          return "[name].js"; // fallback
        },
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      copy({
        targets: [
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
    input: "src/klassify.ts",
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
