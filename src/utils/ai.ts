import { NoteTreeNode } from '../types';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Formats context nodes into Gemini-compatible history.
 * Merges consecutive messages with the same role to ensure alternating roles.
 */
export function formatPrompt(systemPrompt: string, contextNodes: NoteTreeNode[]): GeminiMessage[] {
  const messages: GeminiMessage[] = [];

  // Start with system prompt if provided
  if (systemPrompt) {
    messages.push({
      role: 'user',
      parts: [{ text: `Instructions: ${systemPrompt}` }],
    });
    messages.push({
      role: 'model',
      parts: [{ text: 'I understand and will follow these instructions.' }],
    });
  }

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

  // Gemini history MUST start with user role and end with model role if it's a history
  // but startChat accepts history that ends with either. 
  // However, it MUST alternate.
  
  return messages;
}
