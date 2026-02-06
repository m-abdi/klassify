# Klassify

<!-- Stickers / badges -->

![npm](https://img.shields.io/npm/v/klassify)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/klassify)
![license](https://img.shields.io/npm/l/klassify)
![tests](https://img.shields.io/badge/tests-passing-brightgreen)
![npm link](https://img.shields.io/badge/npm-link-blue)

**Fast, embedding-based text classification for JavaScript**, designed to run **fully on-device** via WebAssembly or through **API-based server inference**.

Klassify focuses on **privacy**, **performance**, and **cross-platform compatibility**, making it suitable for browsers, edge runtimes, and server environments alike.

---

## 🚀 Demo

👉 **Live Demo:**  
<https://your-demo-link-here>

---

## ✨ Features

- ⚡ **Embedding-based classification** for fast and flexible text labeling
- 🧠 **On-device inference** using WebAssembly (no data leaves the device)
- 🔌 **Server-based inference** via API for heavier or centralized workloads
- 🧵 **Web Worker support** for non-blocking inference in browsers
- 🦀 **Rust-powered backends** using the [Candle](https://github.com/huggingface/candle) framework
- 🌍 **Cross-platform**: works in browsers, Node.js, Deno, and other Web-supported runtimes
- 🔄 Modular backend architecture (swap inference engines easily)

---

## 🧠 Architecture Overview

Klassify exposes a primary `Klassify` class for straightforward usage, and additionally provides a **Web Worker interface** for environments where keeping the main thread responsive is critical (e.g. browsers).

### Backends

Klassify supports multiple inference backends:

- **On-device (WASM)**
  - Powered by the **Candle Rust framework**
  - Runs fully locally via WebAssembly
  - Ideal for privacy-sensitive or offline use cases

- **API-based Server Inference**
  - Offload computation to a remote service
  - Useful for larger models or centralized deployment

The backend can be selected at runtime depending on your environment and performance needs.

---

## 📦 Installation

```bash
npm install klassify
```

Or with your favorite package manager.

## 🛠️ Build from Source

If you want to build Klassify locally (including the WASM backend):

### 1. Clone the repository

```bash
git clone https://github.com/m-abdi/klassify
git submodule update --init --recursive
```

### 2. Build the Candle WASM backend

```bash
cd src/core/backends/candle/candle/candle-wasm-examples/bert/
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli
sh build-lib.sh
```

### 3. Install dependencies

```bash
npm install
```

### 4. Build the project

```
npm run build
```

## 🧪 Development & Contribution

Contributions are welcome! 🙌
To keep things clean and consistent:

### 1. Format before committing

```bash
npm run format
```

### 2. Run tests

```bash
npm run test
```

Please open an issue or discussion before submitting large changes.

## 🗺️ Roadmap

- Additional on-device backends

- Smaller / quantized models

- Improved browser Web Worker abstractions
