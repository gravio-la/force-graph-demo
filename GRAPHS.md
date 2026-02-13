# Graph Management Guide

## Overview

This application supports multiple graphs stored as JSON files. Each graph has metadata and can be switched via the dropdown selector in the top-left corner.

## Graph File Structure

Each graph file follows this structure:

```json
{
  "metadata": {
    "name": "Graph Display Name",
    "description": "Detailed description of the graph's purpose and content",
    "timestamp": "2026-02-12T19:00:00Z"
  },
  "graph": {
    "nodes": [
      {
        "id": "unique-id",
        "name": "Display Name",
        "description": "Node description shown in info panel",
        "group": 1
      }
    ],
    "links": [
      {
        "source": "source-node-id",
        "target": "target-node-id",
        "label": "Relationship label"
      }
    ]
  }
}
```

## Metadata Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name shown in the graph selector |
| `description` | string | Yes | Brief description of the graph's content |
| `timestamp` | string | Yes | ISO 8601 date format (YYYY-MM-DDTHH:mm:ssZ) |

## Node Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the node |
| `name` | string | Yes | Display name shown as label |
| `description` | string | No | Detailed description shown in info panel |
| `group` | number | Yes | Color group (1-7 for different colors) |

### Group Colors

- **Group 1**: Blue (#4a9eff)
- **Group 2**: Red (#ff6b6b)
- **Group 3**: Green (#51cf66)
- **Group 4**: Yellow (#ffd43b)
- **Group 5**: Purple (#a78bfa)
- **Group 6**: Pink (#ff8787)
- **Group 7**: Teal (#38d9a9)

## Link Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | Yes | ID of the source node |
| `target` | string | Yes | ID of the target node |
| `label` | string | No | Text shown on the edge |

## Adding a New Graph

### Step 1: Create JSON File

Create a new file in `src/data/` directory:

```bash
src/data/my-new-graph.json
```

### Step 2: Add Graph Data

Use the empty template or copy an existing graph:

```json
{
  "metadata": {
    "name": "My New Graph",
    "description": "Description of my graph",
    "timestamp": "2026-02-12T20:00:00Z"
  },
  "graph": {
    "nodes": [
      {
        "id": "node1",
        "name": "First Node",
        "description": "This is the first node",
        "group": 1
      },
      {
        "id": "node2",
        "name": "Second Node",
        "description": "This is the second node",
        "group": 2
      }
    ],
    "links": [
      {
        "source": "node1",
        "target": "node2",
        "label": "connects to"
      }
    ]
  }
}
```

### Step 3: Register in GraphSelector

Edit `src/components/GraphSelector.tsx`:

1. **Import the graph:**
```typescript
import myNewGraphData from "@/data/my-new-graph.json";
```

2. **Add to the graphs array:**
```typescript
const graphs: GraphFile[] = [
  // ... existing graphs
  {
    id: "my-new-graph",
    path: "/src/data/my-new-graph.json",
    metadata: myNewGraphData.metadata,
    graph: myNewGraphData.graph as any,
  },
];
```

### Step 4: Restart Development Server

```bash
bun run dev
```

The new graph will appear in the dropdown selector!

## Editing an Existing Graph

1. Open the JSON file in `src/data/`
2. Modify nodes, links, or metadata
3. Save the file
4. The changes will be reflected when you switch to that graph

## Graph Examples

### Empty Graph Template

Use `src/data/empty-graph.json` as a starting point for new graphs.

### Philosophical Concepts

`src/data/philosophical-concepts.json` - Complex philosophical relationships

### System Architecture

`src/data/system-architecture.json` - Microservices architecture example

## Tips and Best Practices

### Node IDs
- Use descriptive, lowercase IDs with hyphens
- Keep them unique within a graph
- Example: `user-authentication`, `data-processing`

### Node Names
- Use clear, concise display names
- Can include special characters and spaces
- Example: "User Authentication", "Data Processing Service"

### Descriptions
- Write detailed descriptions for complex nodes
- Use proper grammar and punctuation
- Descriptions appear in the info panel when clicking nodes

### Groups
- Use groups to categorize related nodes
- Nodes in the same group get the same color
- Maximum 7 groups for optimal color distinction

### Links
- Use consistent label conventions
- Examples: "depends on", "connects to", "flows to"
- Keep labels short (2-4 words)

### Timestamps
- Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Update when making significant changes
- Helps track graph versions

## Troubleshooting

### Graph Not Appearing in Dropdown

1. Check JSON syntax is valid
2. Ensure file is in `src/data/` directory
3. Verify import statement in GraphSelector.tsx
4. Confirm graph object is added to the array

### Nodes Not Displaying

- Verify node IDs are unique
- Check `group` field is a number 1-7
- Ensure `name` field exists

### Links Not Showing

- Confirm source and target IDs match existing nodes
- Check link syntax is correct
- Verify nodes exist before links reference them

### Metadata Not Showing

- Ensure all required fields are present
- Check timestamp format is valid ISO 8601
- Verify JSON structure matches template

## Advanced Usage

### Programmatic Graph Generation

You can generate graphs programmatically:

```typescript
const generateGraph = (nodeCount: number) => ({
  metadata: {
    name: `Generated Graph (${nodeCount} nodes)`,
    description: `Automatically generated graph with ${nodeCount} nodes`,
    timestamp: new Date().toISOString(),
  },
  graph: {
    nodes: Array.from({ length: nodeCount }, (_, i) => ({
      id: `node${i}`,
      name: `Node ${i}`,
      description: `Auto-generated node ${i}`,
      group: (i % 7) + 1,
    })),
    links: Array.from({ length: nodeCount - 1 }, (_, i) => ({
      source: `node${i}`,
      target: `node${i + 1}`,
      label: "connects",
    })),
  },
});
```

### External Data Sources

To load graphs from external sources (API, database, etc.), modify `GraphSelector.tsx` to fetch data dynamically instead of importing static JSON files.

## Future Enhancements

Potential features for graph management:
- Graph editing UI (add/remove nodes and links)
- Export graphs to JSON
- Import graphs from file upload
- Version control for graphs
- Graph templates library
- Collaborative graph editing
