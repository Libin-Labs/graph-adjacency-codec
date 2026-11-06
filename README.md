# @lp-labs/graph-adjacency-codec

Directed weighted edge-list and compressed-sparse-row adjacency conversion. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes. No browser globals are accessed at import.

## Install

```sh
npm install @lp-labs/graph-adjacency-codec
```

## Quick start

```js
import { encodeAdjacency } from '@lp-labs/graph-adjacency-codec';
console.log(encodeAdjacency(2, [{ from: 0, to: 1, weight: 4 }]));
```

Use the named ESM imports shown above. CommonJS uses `const { encodeAdjacency } = require('@lp-labs/graph-adjacency-codec');`. Both formats ship declarations.

## Public API and customization

Runtime exports: `encodeAdjacency, decodeAdjacency`.

Public signatures: `encodeAdjacency(nodeCount: number, edges: readonly Edge[]): CsrGraph; decodeAdjacency(graph: CsrGraph): Edge[]`.

Types: `Edge = { from: number; to: number; weight?: number }`; `CsrGraph = { nodeCount: number; rowOffsets: number[]; targets: number[]; weights: number[] }`.

CSR rows and target indices are sorted by source then target; duplicate arcs remain in original order within a row. Missing edge weights default to 1. The codec preserves direction, parallel arcs, loops, and finite weights. All graph vertices are integer indices from `0` to `nodeCount - 1`; edges are copied into algorithm-owned structures. Options are per call; no global configuration.

## Errors, ownership and limits

O(E log E + V) encoding, O(V+E) decoding, nodeCount≤100,000 and E≤1,000,000. CSR arrays are newly allocated and validated on decode. Invalid vertex counts, endpoints, edge shapes, option values, work exhaustion, and impossible numeric results raise `RangeError`. Results are fresh arrays/objects; input arrays are not mutated.

Synchronous algorithms are bounded by stated input/work limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, or callbacks. Finite floating-point behavior applies where weights are used. No I/O, network, persistence, or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript NodeNext builds produce ESM, CommonJS, and declarations. Installed ESM/CommonJS consumer checks and seeded or exhaustive reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
