# Command: build-3d-pizza

## Description
Validates, compresses, and compiles the 3D pizza assets (Draco `.glb` models and GLSL shaders) for the React Three Fiber visualizer.

## Execution Steps
1. Validates mesh geometry normals and UV mappings for pizza dough base.
2. Compresses 3D meshes using Draco compression to under 1.2MB (`public/models/pizza-base.glb`).
3. Runs syntax checks on `src/shaders/cornicione.vert.glsl` and `src/shaders/cornicione.frag.glsl`.
4. Executes WebGL resource cleanup benchmarks to verify zero GPU memory leaks.

## CLI Invocation
```bash
npm --prefix apps/frontend-nextjs run build:3d
```
