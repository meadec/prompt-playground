export const STORAGE_KEYS = {
  SNIPPETS: 'promptEngineer.snippets',
  CATEGORIES: 'promptEngineer.categories',
  TAGS: 'promptEngineer.tags',
  PROMPT_BLOCKS: 'promptEngineer.promptBlocks',
  SETTINGS: 'promptEngineer.settings',
  METADATA: 'promptEngineer.metadata',
} as const

export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  defaultXmlTags: ['system', 'role', 'constraints', 'examples', 'output'],
  autoSave: true,
  showLineNumbers: true,
  indentSize: 2,
  version: '1.0.0',
}

export const DEFAULT_CATEGORIES = [
  {
    name: 'System Prompts',
    color: '#8b5cf6',
    icon: 'Cpu',
  },
  {
    name: 'Examples',
    color: '#3b82f6',
    icon: 'FileText',
  },
  {
    name: 'Constraints',
    color: '#ef4444',
    icon: 'AlertCircle',
  },
]

export const MAX_DEPTH = 10
export const MAX_SNIPPET_PREVIEW_LENGTH = 100
export const DEBOUNCE_DELAY = 300
