import LZString from "lz-string";

export interface GraphMetadata {
  name: string;
  description: string;
  timestamp: string;
}

export interface GraphNode {
  id: string;
  name: string;
  description?: string;
  group: number | string;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/** Payload format for URL encoding: metadata + graph (no id/path). */
export interface SharedGraphPayload {
  metadata: GraphMetadata;
  graph: GraphData;
}

const SHORT_TO_FULL: Record<string, string> = {
  n: "nodes",
  l: "links",
  s: "source",
  t: "target",
  lb: "label",
  g: "group",
};

const FULL_TO_SHORT: Record<string, string> = {
  nodes: "n",
  links: "l",
  source: "s",
  target: "t",
  label: "lb",
  group: "g",
};

type ShortenedGraph = {
  n: unknown[];
  l: unknown[];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Recursively shorten keys only inside graph (graph.n, graph.l, and node/link props). */
export function shortenKeys(payload: SharedGraphPayload): Record<string, unknown> {
  const graph = payload.graph;
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.links)) {
    return payload as unknown as Record<string, unknown>;
  }
  const shortenedNodes = graph.nodes.map((node) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      out[FULL_TO_SHORT[k] ?? k] = v;
    }
    return out;
  });
  const shortenedLinks = graph.links.map((link) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(link)) {
      out[FULL_TO_SHORT[k] ?? k] = v;
    }
    return out;
  });
  return {
    metadata: payload.metadata,
    graph: { n: shortenedNodes, l: shortenedLinks },
  };
}

/** Recursively expand keys only inside graph. */
export function expandKeys(obj: Record<string, unknown>): SharedGraphPayload {
  const metadata = obj.metadata;
  const graph = obj.graph;
  if (!isPlainObject(metadata) || !isPlainObject(graph)) {
    throw new Error("Invalid payload: missing metadata or graph");
  }
  const shortened = graph as unknown as ShortenedGraph;
  const nodes = Array.isArray(shortened.n) ? shortened.n : [];
  const links = Array.isArray(shortened.l) ? shortened.l : [];
  const expandedNodes = nodes.map((node) => {
    if (!isPlainObject(node)) return node;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      out[SHORT_TO_FULL[k] ?? k] = v;
    }
    return out;
  });
  const expandedLinks = links.map((link) => {
    if (!isPlainObject(link)) return link;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(link)) {
      out[SHORT_TO_FULL[k] ?? k] = v;
    }
    return out;
  });
  return {
    metadata: metadata as GraphMetadata,
    graph: { nodes: expandedNodes, links: expandedLinks } as GraphData,
  };
}

function validatePayload(p: SharedGraphPayload): void {
  if (!p.metadata || typeof p.metadata.name !== "string" || typeof p.metadata.description !== "string" || typeof p.metadata.timestamp !== "string") {
    throw new Error("Invalid payload: metadata must have name, description, timestamp");
  }
  if (!p.graph || !Array.isArray(p.graph.nodes) || !Array.isArray(p.graph.links)) {
    throw new Error("Invalid payload: graph must have nodes and links arrays");
  }
}

/** Only these node keys are part of the logical graph (no __threeObj, x/y/z, etc.). */
const ALLOWED_NODE_KEYS = new Set(["id", "name", "description", "group"]);
/** Only these link keys are part of the logical graph. */
const ALLOWED_LINK_KEYS = new Set(["source", "target", "label"]);

/**
 * Sanitize graph to the schema only: strip simulation state (x,y,z,vx,vy,vz),
 * internal library fields (e.g. __threeObj), and any other non-schema keys.
 * Ensures encode/decode never use the internal representation from the 3D view.
 */
export function stripSimulationState(graph: GraphData): GraphData {
  const nodes: GraphNode[] = graph.nodes.map((node) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      if (!ALLOWED_NODE_KEYS.has(k)) continue;
      out[k] = v;
    }
    return out as GraphNode;
  });
  const idSet = new Set(nodes.map((n) => n.id));
  const links: GraphLink[] = graph.links.map((link) => {
    const source = typeof link.source === "object" && link.source && "id" in link.source
      ? (link.source as { id: string }).id
      : String(link.source);
    const target = typeof link.target === "object" && link.target && "id" in link.target
      ? (link.target as { id: string }).id
      : String(link.target);
    if (!idSet.has(source) || !idSet.has(target)) return null;
    const out: GraphLink = { source, target };
    if (link.label != null && link.label !== "") out.label = link.label;
    return out;
  }).filter((l): l is GraphLink => l !== null);
  return { nodes, links };
}

/** Encode: payload → shorten keys → JSON → compress → URL-safe base64. */
export function encode(payload: SharedGraphPayload): string {
  const shortened = shortenKeys(payload);
  const json = JSON.stringify(shortened);
  return LZString.compressToEncodedURIComponent(json);
}

/** Decode: URL-safe base64 → decompress → JSON → expand keys → validate. */
export function decode(str: string): SharedGraphPayload {
  if (!str || typeof str !== "string") {
    throw new Error("Empty or invalid hash");
  }
  const json = LZString.decompressFromEncodedURIComponent(str);
  if (json == null || json === "") {
    throw new Error("Failed to decompress hash");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON in hash");
  }
  if (!isPlainObject(parsed)) {
    throw new Error("Decoded value is not an object");
  }
  const payload = expandKeys(parsed);
  validatePayload(payload);
  return payload;
}
