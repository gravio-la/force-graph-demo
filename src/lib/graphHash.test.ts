import { describe, expect, test } from "bun:test";
import LZString from "lz-string";
import {
  encode,
  decode,
  shortenKeys,
  expandKeys,
  stripSimulationState,
  type SharedGraphPayload,
} from "./graphHash";

const samplePayload: SharedGraphPayload = {
  metadata: {
    name: "Test Graph",
    description: "A test",
    timestamp: "2026-02-12T19:30:00Z",
  },
  graph: {
    nodes: [
      { id: "a", name: "Node A", description: "Desc A", group: 1 },
      { id: "b", name: "Node B", group: 2 },
    ],
    links: [
      { source: "a", target: "b", label: "connects to" },
    ],
  },
};

const emptyPayload: SharedGraphPayload = {
  metadata: {
    name: "Empty graph",
    description: "Empty",
    timestamp: "2026-02-12T19:30:00Z",
  },
  graph: { nodes: [], links: [] },
};

describe("shortenKeys / expandKeys", () => {
  test("roundtrip restores original payload", () => {
    const shortened = shortenKeys(samplePayload);
    const expanded = expandKeys(shortened as unknown as Record<string, unknown>);
    expect(expanded).toEqual(samplePayload);
  });

  test("shortened graph uses n and l keys", () => {
    const shortened = shortenKeys(samplePayload) as { graph: { n: unknown[]; l: unknown[] } };
    expect(shortened.graph).toBeDefined();
    expect(shortened.graph.n).toBeDefined();
    expect(shortened.graph.l).toBeDefined();
    expect((shortened.graph as Record<string, unknown>).nodes).toBeUndefined();
    expect((shortened.graph as Record<string, unknown>).links).toBeUndefined();
  });

  test("shortened nodes use g, links use s/t/lb", () => {
    const shortened = shortenKeys(samplePayload) as {
      graph: { n: Record<string, unknown>[]; l: Record<string, unknown>[] };
    };
    const firstNode = shortened.graph.n[0];
    const firstLink = shortened.graph.l[0];
    expect(firstNode).toHaveProperty("g", 1);
    expect(firstNode).not.toHaveProperty("group");
    expect(firstLink).toHaveProperty("s", "a");
    expect(firstLink).toHaveProperty("t", "b");
    expect(firstLink).toHaveProperty("lb", "connects to");
    expect(firstLink).not.toHaveProperty("source");
    expect(firstLink).not.toHaveProperty("target");
    expect(firstLink).not.toHaveProperty("label");
  });
});

describe("encode / decode", () => {
  test("encode then decode returns deep equal payload", () => {
    const encoded = encode(samplePayload);
    expect(encoded).toBeTruthy();
    const decoded = decode(encoded);
    expect(decoded).toEqual(samplePayload);
  });

  test("roundtrip with empty graph", () => {
    const encoded = encode(emptyPayload);
    const decoded = decode(encoded);
    expect(decoded).toEqual(emptyPayload);
  });

  test("encoded string does not contain full key names in decompressed JSON", () => {
    const encoded = encode(samplePayload);
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    expect(decompressed).not.toContain('"nodes"');
    expect(decompressed).not.toContain('"links"');
    expect(decompressed).not.toContain('"source"');
    expect(decompressed).not.toContain('"target"');
    expect(decompressed).not.toContain('"label"');
    expect(decompressed).not.toContain('"group"');
  });

  test("decode of invalid string throws", () => {
    expect(() => decode("")).toThrow();
    expect(() => decode("not-valid-base64!!!")).toThrow();
    expect(() => decode("N4I")).toThrow(); // decompresses to invalid JSON
  });

  test("decode of malformed JSON throws", () => {
    const compressed = LZString.compressToEncodedURIComponent("{ invalid }");
    expect(() => decode(compressed)).toThrow();
  });
});

describe("stripSimulationState", () => {
  test("strips x, y, z, vx, vy, vz from nodes", () => {
    const graph = {
      nodes: [
        { id: "a", name: "A", group: 1, x: 10, y: 20, z: 30, vx: 0.1, vy: 0.2, vz: 0.3 },
      ],
      links: [{ source: "a", target: "b" }],
    };
    const out = stripSimulationState(graph as SharedGraphPayload["graph"]);
    expect(out.nodes[0]).not.toHaveProperty("x");
    expect(out.nodes[0]).not.toHaveProperty("y");
    expect(out.nodes[0]).not.toHaveProperty("z");
    expect(out.nodes[0]).not.toHaveProperty("vx");
    expect(out.nodes[0]).toHaveProperty("id", "a");
    expect(out.nodes[0]).toHaveProperty("name", "A");
    expect(out.nodes[0]).toHaveProperty("group", 1);
  });

  test("normalizes link source/target to strings", () => {
    const graph = {
      nodes: [{ id: "a", name: "A", group: 1 }, { id: "b", name: "B", group: 1 }],
      links: [
        { source: { id: "a" }, target: { id: "b" }, label: "connects" },
      ],
    };
    const out = stripSimulationState(graph as SharedGraphPayload["graph"]);
    expect(out.links[0].source).toBe("a");
    expect(out.links[0].target).toBe("b");
    expect(out.links[0].label).toBe("connects");
  });

  test("strips internal library fields like __threeObj", () => {
    const graph = {
      nodes: [
        {
          id: "a",
          name: "A",
          group: 1,
          __threeObj: { metadata: { version: 4 }, geometries: [] },
          x: 1,
          y: 2,
          z: 3,
        },
      ],
      links: [{ source: "a", target: "b" }],
    };
    const out = stripSimulationState(graph as SharedGraphPayload["graph"]);
    expect(out.nodes[0]).not.toHaveProperty("__threeObj");
    expect(out.nodes[0]).not.toHaveProperty("x");
    expect(out.nodes[0]).toEqual({ id: "a", name: "A", group: 1 });
  });
});
