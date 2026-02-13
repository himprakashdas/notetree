import { Node, Edge } from '@xyflow/react';

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
  systemPrompt: string;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  content: string;
  type: 'user' | 'ai';
  thinking?: boolean;
  createdAt: number;
}

export type NoteTreeNode = Node<NodeData>;
export type NoteTreeEdge = Edge;

export interface DBNode extends NoteTreeNode {
  projectId: string;
}

export interface DBEdge extends NoteTreeEdge {
  projectId: string;
}
