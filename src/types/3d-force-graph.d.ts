declare module '3d-force-graph' {
  import { Object3D } from 'three';

  export interface NodeObject {
    id: string | number;
    name?: string;
    description?: string;
    group?: number;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number;
    fy?: number;
    fz?: number;
    [key: string]: any;
  }

  export interface LinkObject {
    source: string | number | NodeObject;
    target: string | number | NodeObject;
    label?: string;
    [key: string]: any;
  }

  export interface GraphData {
    nodes: NodeObject[];
    links: LinkObject[];
  }

  export interface ForceGraphConfig {
    extraRenderers?: any[];
  }

  export interface ForceGraphInstance {
    (element: HTMLElement): ForceGraphInstance;
    graphData(): GraphData;
    graphData(data: GraphData): ForceGraphInstance;
    nodeLabel(label: string | ((node: NodeObject) => string)): ForceGraphInstance;
    nodeAutoColorBy(field: string | ((node: NodeObject) => string)): ForceGraphInstance;
    nodeOpacity(opacity: number): ForceGraphInstance;
    nodeThreeObject(callback: (node: NodeObject) => Object3D | null): ForceGraphInstance;
    nodeThreeObjectExtend(extend: boolean): ForceGraphInstance;
    linkSource(field: string): ForceGraphInstance;
    linkTarget(field: string): ForceGraphInstance;
    linkDirectionalParticles(particles: number): ForceGraphInstance;
    linkDirectionalParticleSpeed(speed: number): ForceGraphInstance;
    linkWidth(width: number | ((link: LinkObject) => number)): ForceGraphInstance;
    linkOpacity(opacity: number): ForceGraphInstance;
    linkThreeObject(callback: (link: LinkObject) => Object3D | null): ForceGraphInstance;
    linkThreeObjectExtend(extend: boolean): ForceGraphInstance;
    linkPositionUpdate(callback: (sprite: Object3D, coords: { start: { x: number, y: number, z: number }, end: { x: number, y: number, z: number } }, link: LinkObject) => void): ForceGraphInstance;
    backgroundColor(color: string): ForceGraphInstance;
    width(width: number): ForceGraphInstance;
    height(height: number): ForceGraphInstance;
    onNodeClick(callback: (node: NodeObject, event?: MouseEvent) => void): ForceGraphInstance;
    _destructor(): void;
    [key: string]: any;
  }

  export default function ForceGraph3D(config?: ForceGraphConfig): ForceGraphInstance;
}
