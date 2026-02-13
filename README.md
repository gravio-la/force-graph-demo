# Force Graph Explorer (3D & 2D)

A fullscreen interactive force graph visualization application with **dual visualization modes**: 3D and 2D. Built with React, Bun, Three.js, and Sigma.js.

> **Disclaimer:** This project was created as part of a flow coding session with the help of an AI agent for testing concepts. It is experimental and may contain rough edges.

## Features

- **Three Visualization Modes (3D, Cosmo, 2D)**
  - 🎲 **3D Force Graph** – Interactive 3D exploration with `3d-force-graph` and Three.js
  - 🌐 **Cosmo** – GPU-accelerated graph view with Cosmograph
  - 🔗 **2D Network Graph** – Flat network view with Sigma.js and Graphology
  - Switch between modes anytime with the bottom-center toggle – all views stay in sync

- **Multiple Graph Management**
  - 📊 Store multiple graphs in separate JSON files
  - 🔄 Switch between graphs using the dropdown selector (top-left)
  - 📝 Each graph has metadata (name, description, timestamp)
  - ✏️ Add and edit custom graphs via the in-app modal (YAML editor)
  - 🆕 Includes empty graph template ready to fill

- **Interactive Elements**
  - Click nodes to view detailed information
  - Search and filter nodes in real-time
  - Permanent node and edge labels
  - Smooth animations and transitions

- **UI Components**
  - Graph selector dropdown (top-left)
  - Expandable search overlay (top-right)
  - Node information panel (below search)
  - Visualization mode toggle (bottom-center)
  - All overlays with backdrop blur and modern styling

- **State Management**
  - Zustand store for global state
  - Persistent graph data structure
  - Synchronized search and selection across views

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **3D Visualization**: 3d-force-graph + Three.js
- **Cosmo Visualization**: Cosmograph (@cosmograph/react)
- **2D Visualization**: Sigma.js + Graphology
- **State**: Zustand
- **UI Components**: Radix UI (via shadcn), CodeMirror (YAML graph editor)

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Project Structure

```
src/
├── components/
│   ├── ForceGraph3D.tsx       # 3D force graph visualization
│   ├── CosmographGraph.tsx    # Cosmo (Cosmograph) visualization
│   ├── SigmaGraph.tsx         # 2D network graph visualization
│   ├── SearchOverlay.tsx      # Search and filter UI
│   ├── NodeInfoOverlay.tsx    # Node details panel
│   ├── VisualizationToggle.tsx # 3D / Cosmo / 2D mode switch
│   ├── GraphSelector.tsx      # Multi-graph dropdown selector
│   ├── GraphEditorModal.tsx   # Add/edit graphs (YAML)
│   └── ui/                    # shadcn components
├── lib/
│   ├── groupColors.ts         # Central node group color palette
│   └── utils.ts               # Utilities
├── data/
│   ├── consciousness_graph.json   # Default graph – philosophy of mind
│   ├── philosophical-concepts.json # Steiner's philosophy graph
│   ├── system-architecture.json    # System architecture example
│   └── empty-graph.json            # Empty template graph
├── store/
│   └── graphStore.ts          # Zustand state management
├── types/
│   ├── 3d-force-graph.d.ts   # TypeScript definitions
│   └── json.d.ts              # JSON module declarations
├── App.tsx                    # Main application
└── index.tsx                  # Server entry point
```

## Graph Data

Graphs are stored as JSON files in `src/data/` directory. Each file contains:
- **Metadata**: name, description, timestamp
- **Graph data**: nodes and links

### Available Graphs

1. **consciousness_graph.json** – Philosophy of mind (Bewusstsein) – *default*
2. **system-architecture.json** – Microservices architecture
3. **empty-graph.json** – Empty template ready to fill

### Managing Graphs

For detailed instructions on creating, editing, and managing graphs, see **[GRAPHS.md](./GRAPHS.md)**.

Quick start:
- Click the dropdown in the top-left to switch between graphs
- Use **Add new graph** in the dropdown to create custom graphs (YAML editor)
- Edit built-in graphs in `src/data/` or create new JSON files
- Use `empty-graph.json` as a template for new graphs

### Node Structure
```typescript
{
  id: string;           // Unique identifier
  name: string;         // Display name
  description?: string; // Detailed description
  group: number;        // Color group (1-7)
}
```

### Link Structure
```typescript
{
  source: string;  // Source node ID
  target: string;  // Target node ID
  label?: string;  // Edge label
}
```

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Toggle search overlay
- `ESC`: Close search overlay (when expanded)

## Customization

### Colors
Node colors are defined by group (1-7). All views (3D, Cosmo, 2D) and the node info panel use a central palette. Edit `getGroupColor` and `GROUP_COLOR_PALETTE` in **`src/lib/groupColors.ts`**.

### Labels
- Node labels: Always visible in both 3D and 2D
- Edge labels: Always visible in both views
- Text size and styling can be adjusted in the respective component files

## License

MIT
