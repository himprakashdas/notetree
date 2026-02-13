import { NoteTreeNode, NoteTreeEdge } from '../types';
import { projectRepository } from '../db/repository';
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getGeminiModelName = (modelName = "gemini-2.5-flash") => {
  return modelName;
};

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ContextSnapshot {
  systemPrompt: string;
  history: GeminiMessage[];
}

/**
 * Formats context nodes into Gemini-compatible history.
 * Merges consecutive messages with the same role to ensure alternating roles.
 */
export function formatPrompt(systemPrompt: string, contextNodes: NoteTreeNode[]): GeminiMessage[] {
  const messages: GeminiMessage[] = [];

  contextNodes.forEach((node) => {
    const text = node.data.label + (node.data.content ? `\n\n${node.data.content}` : '');
    if (!text.trim()) return;

    const role = node.data.type === 'ai' ? 'model' : 'user';
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.role === role) {
      // Merge with last message if same role
      lastMessage.parts[0].text += `\n\n---\n\n${text}`;
    } else {
      messages.push({
        role,
        parts: [{ text }],
      });
    }
  });

  return messages;
}

/**
 * Creates a snapshot of the context for a given node.
 */
export async function createContextSnapshot(
  projectId: string,
  nodeId: string,
  nodes?: NoteTreeNode[],
  edges?: NoteTreeEdge[]
): Promise<ContextSnapshot> {
  const { systemPrompt, contextNodes } = await projectRepository.getAIContext(projectId, nodeId, nodes, edges);

  return {
    systemPrompt,
    history: formatPrompt(systemPrompt, contextNodes),
  };
}

/**
 * Helper to get the GenAI client instance
 */
export const getGenAIClient = () => ai;

/**
 * SDK-native token counting
 */
export async function countTokens(model = "gemini-2.5-flash", contents: GeminiMessage[], systemInstruction?: string) {
  try {
    const response = await ai.models.countTokens({
      model,
      contents,
      config: systemInstruction ? { systemInstruction } : undefined
    });
    return response.totalTokens;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return 0;
  }
}
