export interface Snippet {
  id: string
  title: string
  content: string
  categoryId: string | null
  tagIds: string[]
  isFavorite: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color?: string
  icon?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  color?: string
  createdAt: string
}

export interface PromptBlock {
  id: string
  type: 'text' | 'snippet' | 'container'
  content: string
  snippetId: string | null
  xmlTag: string | null
  xmlAttributes: Record<string, string>
  parentId: string | null
  order: number
  depth: number
  isCollapsed: boolean
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  defaultXmlTags: string[]
  autoSave: boolean
  showLineNumbers: boolean
  indentSize: number
  version: string
}

export interface StorageMetadata {
  version: string
  lastBackup: string | null
  installDate: string
  lastModified: string
}

export type BlockType = PromptBlock['type']

export interface PromptBlockWithChildren extends PromptBlock {
  children: PromptBlockWithChildren[]
}
