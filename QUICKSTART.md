# Quick Start Guide - Multi-Graph Explorer

## 🚀 Getting Started

### Starting the Application

```bash
bun run dev
```

The app will start at `http://localhost:3001` (or another port if 3001 is in use).

## 🎮 User Interface Overview

### Top-Left: Graph Selector (NEW!)
- **Database icon button** - Click to open the graph dropdown
- Shows current graph name
- Lists all available graphs with their descriptions
- Shows node/link counts for each graph

### Top-Right: Search Overlay
- **Search icon** - Click or press `Ctrl+K` to open
- Search for nodes by name or ID
- Shows suggestions as you type
- Filters the graph in real-time

### Top-Right (below search): Node Info Panel
- **Info icon** - Appears when collapsed
- Shows detailed information about selected nodes
- Displays node description, group, and position
- Click any node in the graph to open

### Bottom-Center: Visualization Toggle
- **3D View** - Full 3D force-directed graph
- **2D View** - Flat network visualization with Sigma.js
- Toggle between views anytime

## 📊 Working with Multiple Graphs

### Switching Between Graphs

1. Click the **Database icon** in the top-left
2. Browse available graphs in the dropdown
3. Click on any graph to switch
4. The view will reload with the new graph

### Current Available Graphs

#### 1. Philosophical Concepts (Default)
Your custom philosophical graph exploring Steiner's problem with phenomenology, ontology, and taxonomy.
- **14 nodes** covering philosophical concepts
- **17 relationships** between concepts
- Color-coded by philosophical category

#### 2. System Architecture
Example microservices architecture showing how different system components interact.
- **10 nodes** representing services
- **9 connections** showing data flow
- Demonstrates technical architecture patterns

#### 3. Empty Graph
A blank template ready for you to fill with your own data.
- **0 nodes** - completely empty
- Ready to be populated with your custom data
- Perfect starting point for new projects

## ✏️ Creating Your Own Graph

### Option 1: Edit Empty Graph

1. Open `src/data/empty-graph.json`
2. Add your nodes and links
3. Update metadata (name, description)
4. Save and reload the app
5. Select "Empty Graph" from the dropdown

### Option 2: Create New Graph File

1. Copy `src/data/empty-graph.json` to `src/data/my-graph.json`
2. Edit the file with your data
3. Register it in `src/components/GraphSelector.tsx`:

```typescript
import myGraphData from "@/data/my-graph.json";

// Add to the graphs array:
{
  id: "my-graph",
  path: "/src/data/my-graph.json",
  metadata: myGraphData.metadata,
  graph: myGraphData.graph as any,
}
```

4. Restart the dev server
5. Your graph appears in the dropdown!

See **[GRAPHS.md](./GRAPHS.md)** for detailed instructions.

## 🎯 Basic Node Structure

```json
{
  "id": "my-node",
  "name": "My Node Name",
  "description": "What this node represents",
  "group": 1
}
```

- **id**: Unique identifier (lowercase, hyphens)
- **name**: Display name (shows on graph)
- **description**: Detailed info (shows when clicked)
- **group**: Color group 1-7

## 🔗 Basic Link Structure

```json
{
  "source": "node1-id",
  "target": "node2-id",
  "label": "relationship type"
}
```

- **source**: Starting node ID
- **target**: Ending node ID
- **label**: Text shown on the edge

## 🎨 Color Groups

Choose group number for node colors:
1. Blue - Primary/Central
2. Red - Critical/Important
3. Green - Success/Active
4. Yellow - Warning/Process
5. Purple - Abstract/Concept
6. Pink - Secondary
7. Teal - Support/Utility

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Toggle search overlay
- `ESC` - Close search overlay

## 🔄 Workflow Example

### Creating a Knowledge Graph

1. **Start with empty graph**
   - Select "New Graph" from dropdown
   - Open `src/data/empty-graph.json`

2. **Add core concepts** (nodes)
   ```json
   {
     "id": "concept-1",
     "name": "Core Concept",
     "description": "This is a fundamental idea",
     "group": 1
   }
   ```

3. **Add relationships** (links)
   ```json
   {
     "source": "concept-1",
     "target": "concept-2",
     "label": "influences"
   }
   ```

4. **Update metadata**
   ```json
   {
     "name": "My Knowledge Graph",
     "description": "Personal knowledge management system",
     "timestamp": "2026-02-12T20:00:00Z"
   }
   ```

5. **View and iterate**
   - Save the file
   - Switch to your graph in the dropdown
   - Click nodes to verify descriptions
   - Adjust as needed

## 🐛 Common Issues

### Graph not showing?
- Check JSON syntax is valid
- Ensure all required fields are present
- Verify node IDs in links match node IDs

### Can't find my graph in dropdown?
- Check file is in `src/data/` directory
- Verify import statement in GraphSelector
- Restart dev server

### Nodes not connecting?
- Confirm source/target IDs match existing nodes
- Check spelling and case sensitivity
- Ensure nodes exist before links reference them

## 📚 Further Reading

- **[README.md](./README.md)** - Full application documentation
- **[GRAPHS.md](./GRAPHS.md)** - Complete graph management guide

## 💡 Tips

- Use descriptive node IDs for easier debugging
- Keep node names concise for better label visibility
- Group related concepts with the same color
- Use consistent label conventions across your graph
- Update timestamps when making major changes
- Start small and iterate - add nodes gradually

---

Happy graph exploring! 🎉
