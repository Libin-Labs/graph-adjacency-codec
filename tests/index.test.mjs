import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
test('CSR conversion round-trips weighted directed edges with duplicates', () => {
  const edges = [
    { from: 1, to: 0, weight: -2 },
    { from: 0, to: 2, weight: 4 },
    { from: 1, to: 0, weight: 7 },
    { from: 2, to: 2, weight: 1 },
  ];
  assert.deepEqual(lib.decodeAdjacency(lib.encodeAdjacency(3, edges)), [
    { from: 0, to: 2, weight: 4 },
    { from: 1, to: 0, weight: -2 },
    { from: 1, to: 0, weight: 7 },
    { from: 2, to: 2, weight: 1 },
  ]);
});
test('unweighted input uses documented default unit weight', () => {
  assert.deepEqual(lib.decodeAdjacency(lib.encodeAdjacency(2, [{ from: 0, to: 1 }])), [
    { from: 0, to: 1, weight: 1 },
  ]);
});
test('encoding copies edge data and sorting is stable for parallel arcs', () => {
  const input = [
    { from: 0, to: 1, weight: 8 },
    { from: 0, to: 1, weight: 3 },
  ];
  const csr = lib.encodeAdjacency(2, input);
  input[0].weight = 42;
  assert.deepEqual(csr.weights, [8, 3]);
});
test('empty rows and self loops have valid row offsets', () => {
  assert.deepEqual(lib.encodeAdjacency(4, [{ from: 2, to: 2 }]), {
    nodeCount: 4,
    rowOffsets: [0, 0, 0, 1, 1],
    targets: [2],
    weights: [1],
  });
});
test('malformed CSR lengths, offsets, targets and weights reject', () => {
  assert.throws(
    () => lib.decodeAdjacency({ nodeCount: 2, rowOffsets: [0, 1], targets: [1], weights: [1] }),
    RangeError,
  );
  assert.throws(
    () => lib.decodeAdjacency({ nodeCount: 2, rowOffsets: [0, 2, 1], targets: [1], weights: [1] }),
    RangeError,
  );
  assert.throws(
    () => lib.decodeAdjacency({ nodeCount: 2, rowOffsets: [0, 1, 1], targets: [2], weights: [1] }),
    RangeError,
  );
  assert.throws(
    () =>
      lib.decodeAdjacency({
        nodeCount: 2,
        rowOffsets: [0, 1, 1],
        targets: [1],
        weights: [Infinity],
      }),
    RangeError,
  );
});
test('invalid weights, endpoints and node counts reject', () => {
  assert.throws(() => lib.encodeAdjacency(2, [{ from: 0, to: 1, weight: NaN }]), RangeError);
  assert.throws(() => lib.encodeAdjacency(2, [{ from: 0, to: 2 }]), RangeError);
  assert.throws(() => lib.encodeAdjacency(0, []), RangeError);
});
