import {
  decodeAdjacency,
  encodeAdjacency,
  type CsrGraph,
  type Edge,
} from '@lp-labs/graph-adjacency-codec';
export type PublicTypes = [Edge, CsrGraph];
void encodeAdjacency;
void decodeAdjacency;
// @ts-expect-error public API requires numeric vertex counts
decodeAdjacency('invalid');
