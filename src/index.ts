export interface Edge {
  from: number;
  to: number;
  weight?: number;
}
export interface CsrGraph {
  nodeCount: number;
  rowOffsets: number[];
  targets: number[];
  weights: number[];
}
function validNodeCount(value: number): void {
  if (!Number.isSafeInteger(value) || value < 1 || value > 100_000)
    throw new RangeError('Invalid nodeCount');
}
export function encodeAdjacency(nodeCount: number, edges: readonly Edge[]): CsrGraph {
  validNodeCount(nodeCount);
  if (!Array.isArray(edges) || edges.length > 1_000_000) throw new RangeError('Invalid edges');
  const copied = edges.map((edge, edgeId) => {
    if (!edge || typeof edge !== 'object') throw new RangeError('Invalid edge');
    const { from, to, weight } = edge;
    if (weight !== undefined && !Number.isFinite(weight))
      throw new RangeError('Invalid edge weight');
    const value = weight ?? 1;
    if (
      !Number.isSafeInteger(from) ||
      !Number.isSafeInteger(to) ||
      from < 0 ||
      to < 0 ||
      from >= nodeCount ||
      to >= nodeCount ||
      !Number.isFinite(value)
    )
      throw new RangeError('Invalid edge');
    return { from, to, weight: value, edgeId };
  });
  copied.sort((a, b) => a.from - b.from || a.to - b.to || a.edgeId - b.edgeId);
  const rowOffsets = Array<number>(nodeCount + 1).fill(0);
  const targets: number[] = [];
  const weights: number[] = [];
  for (const edge of copied) {
    rowOffsets[edge.from + 1] = rowOffsets[edge.from + 1]! + 1;
    targets.push(edge.to);
    weights.push(edge.weight);
  }
  for (let i = 1; i <= nodeCount; i++) rowOffsets[i] = rowOffsets[i]! + rowOffsets[i - 1]!;
  return { nodeCount, rowOffsets, targets, weights };
}
export function decodeAdjacency(graph: CsrGraph): Edge[] {
  if (!graph || typeof graph !== 'object') throw new RangeError('Invalid CSR graph');
  const { nodeCount, rowOffsets, targets, weights } = graph;
  validNodeCount(nodeCount);
  if (
    !Array.isArray(rowOffsets) ||
    !Array.isArray(targets) ||
    !Array.isArray(weights) ||
    rowOffsets.length !== nodeCount + 1 ||
    targets.length !== weights.length ||
    targets.length > 1_000_000 ||
    rowOffsets[0] !== 0 ||
    rowOffsets[nodeCount] !== targets.length
  )
    throw new RangeError('Malformed CSR arrays');
  const result: Edge[] = [];
  for (let from = 0; from < nodeCount; from++) {
    const start = rowOffsets[from]!;
    const end = rowOffsets[from + 1]!;
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      end < start ||
      end > targets.length
    )
      throw new RangeError('CSR row offsets must be monotone integers');
    for (let i = start; i < end; i++) {
      const to = targets[i]!;
      const weight = weights[i]!;
      if (!Number.isSafeInteger(to) || to < 0 || to >= nodeCount || !Number.isFinite(weight))
        throw new RangeError('Invalid CSR entry');
      result.push({ from, to, weight });
    }
  }
  return result;
}
