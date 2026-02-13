import { Node, Edge } from '@xyflow/react';

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  content: string;
  type: 'user' | 'ai';
}

export type NoteTreeNode = Node<NodeData>;
export type NoteTreeEdge = Edge;

export interface DBNode extends NoteTreeNode {
  projectId: string;
}

export interface DBEdge extends NoteTreeEdge {
  projectId: string;
}
