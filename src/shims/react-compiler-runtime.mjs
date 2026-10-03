// rolldown-vite's dep optimizer converts `react-compiler-runtime@1.0.0`'s CJS
// build to ESM but drops its named exports, so `@sanity/ui`'s
// `import { c } from 'react-compiler-runtime'` (in the embedded Studio's Visual
// Editing) resolves to nothing and the island fails to hydrate.
//
// This shim is aliased in for the bare specifier only (see astro.config.mjs) and
// re-exports the CJS members explicitly. The subpath import below bypasses the
// alias so it reaches the real module.
import runtime from 'react-compiler-runtime/dist/index.js';

export const {
  $dispatcherGuard,
  $makeReadOnly,
  $reset,
  $structuralCheck,
  c,
  clearRenderCounterRegistry,
  renderCounterRegistry,
  useRenderCounter,
} = runtime;

export default runtime;
