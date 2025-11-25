
export interface SankeyNode {
  name: string;
  category: 'actor_segmentation' | 'resource_origin' | 'resource' | 'intermediate' | 'expense' | 'expense_nature' | 'expense_detail';
  value?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface BudgetData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}