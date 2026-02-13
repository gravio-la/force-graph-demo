# 3D Force Graph Explorer

A fullscreen interactive 3D/2D force graph visualization application built with React, Bun, Three.js, and Sigma.js.

## Features

- **Multiple Graph Management**
  - 📊 Store multiple graphs in separate JSON files
  - 🔄 Switch between graphs using the dropdown selector (top-left)
  - 📝 Each graph has metadata (name, description, timestamp)
  - 🆕 Includes empty graph template ready to fill

- **Dual Visualization Modes**
  - 🎲 3D Force Graph (using `3d-force-graph` and Three.js)
  - 🔗 2D Network Graph (using Sigma.js and Graphology)
  - Toggle between modes with the bottom-center button

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
- **2D Visualization**: Sigma.js + Graphology
- **State**: Zustand
- **UI Components**: Radix UI (via shadcn)

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
│   ├── SigmaGraph.tsx         # 2D sigma.js visualization
│   ├── SearchOverlay.tsx      # Search and filter UI
│   ├── NodeInfoOverlay.tsx    # Node details panel
│   ├── VisualizationToggle.tsx # 2D/3D mode switch
│   ├── GraphSelector.tsx      # Multi-graph dropdown selector
│   └── ui/                    # shadcn components
├── data/
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

1. **philosophical-concepts.json** - Steiner's philosophical problem
2. **system-architecture.json** - Microservices architecture example
3. **empty-graph.json** - Empty template ready to fill

### Managing Graphs

For detailed instructions on creating, editing, and managing graphs, see **[GRAPHS.md](./GRAPHS.md)**

Quick start:
- Click the dropdown in the top-left to switch between graphs
- Edit JSON files in `src/data/` to modify graphs
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
Node colors are defined by group (1-7). Edit the `getGroupColor` function in:
- `src/components/SigmaGraph.tsx` (for 2D)
- `src/components/NodeInfoOverlay.tsx` (for info panel)

### Labels
- Node labels: Always visible in both 3D and 2D
- Edge labels: Always visible in both views
- Text size and styling can be adjusted in the respective component files

## License

MIT
