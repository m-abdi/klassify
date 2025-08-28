import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

export default [
  // JS Bundles
  {
    input: { klassify: "src/klassify.ts", "klassify.worker": "src/klassify.worker.ts" },
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: false,
        chunkFileNames: ({ name }) => {
          return "[name].js";
        },
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      copy({
        targets: [
          {
            src: "src/core/libs/fasttext/ft.wasm",
            dest: "dist/",
          },
          {
            src: "src/core/libs/candle/candle/candle-wasm-examples/bert/build/m_bg.wasm",
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
    input: "src/klassify.worker.ts",
    output: {
      file: "dist/klassify.worker.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
