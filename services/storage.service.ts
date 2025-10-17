import { v4 as uuidv4 } from 'uuid'
import type {
  Snippet,
  Category,
  Tag,
  PromptBlock,
  AppSettings,
  StorageMetadata,
  PromptBlockWithChildren,
} from '@/types'
import type {
  CreateSnippetInput,
  CreateCategoryInput,
  CreateTagInput,
  CreatePromptBlockInput,
} from '@/lib/validators'
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/lib/constants'

class StorageService {
  private isBrowser = typeof window !== 'undefined'

  // ========== Utility Methods ==========

  private getItem<T>(key: string): Record<string, T> {
    if (!this.isBrowser) return {}
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return {}
    }
  }

  private setItem<T>(key: string, data: Record<string, T>): void {
    if (!this.isBrowser) return
    try {
      localStorage.setItem(key, JSON.stringify(data))
      this.updateMetadata()
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      throw new Error('Failed to save data. Storage quota may be exceeded.')
    }
  }

  private updateMetadata(): void {
    const metadata = this.getMetadata()
    metadata.lastModified = new Date().toISOString()
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata))
    }
  }

  // ========== Snippet Operations ==========

  getAllSnippets(): Snippet[] {
    const snippetsMap = this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS)
    return Object.values(snippetsMap).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  getSnippetById(id: string): Snippet | null {
    const snippetsMap = this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS)
    return snippetsMap[id] || null
  }

  createSnippet(input: CreateSnippetInput): Snippet {
    const snippet: Snippet = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const snippetsMap = this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS)
    snippetsMap[snippet.id] = snippet
    this.setItem(STORAGE_KEYS.SNIPPETS, snippetsMap)

    return snippet
  }

  updateSnippet(id: string, updates: Partial<Snippet>): Snippet | null {
    const snippetsMap = this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS)
    const snippet = snippetsMap[id]

    if (!snippet) return null

    const updatedSnippet: Snippet = {
      ...snippet,
      ...updates,
      id, // Prevent ID changes
      updatedAt: new Date().toISOString(),
    }

    snippetsMap[id] = updatedSnippet
    this.setItem(STORAGE_KEYS.SNIPPETS, snippetsMap)

    return updatedSnippet
  }

  deleteSnippet(id: string): boolean {
    // Check if snippet is referenced by any blocks
    const blocks = this.getAllBlocks()
    const isReferenced = blocks.some((block) => block.snippetId === id)

    if (isReferenced) {
      throw new Error('Cannot delete snippet: it is being used in the prompt builder')
    }

    const snippetsMap = this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS)
    if (!snippetsMap[id]) return false

    delete snippetsMap[id]
    this.setItem(STORAGE_KEYS.SNIPPETS, snippetsMap)

    return true
  }

  incrementSnippetUsage(id: string): void {
    const snippet = this.getSnippetById(id)
    if (snippet) {
      this.updateSnippet(id, { usageCount: snippet.usageCount + 1 })
    }
  }

  searchSnippets(query: string): Snippet[] {
    if (!query.trim()) return this.getAllSnippets()

    const lowerQuery = query.toLowerCase()
    return this.getAllSnippets().filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(lowerQuery) ||
        snippet.content.toLowerCase().includes(lowerQuery)
    )
  }

  getSnippetsByCategory(categoryId: string): Snippet[] {
    return this.getAllSnippets().filter((s) => s.categoryId === categoryId)
  }

  getSnippetsByTag(tagId: string): Snippet[] {
    return this.getAllSnippets().filter((s) => s.tagIds.includes(tagId))
  }

  getFavoriteSnippets(): Snippet[] {
    return this.getAllSnippets().filter((s) => s.isFavorite)
  }

  // ========== Category Operations ==========

  getAllCategories(): Category[] {
    const categoriesMap = this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    return Object.values(categoriesMap).sort((a, b) => a.order - b.order)
  }

  getCategoryById(id: string): Category | null {
    const categoriesMap = this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    return categoriesMap[id] || null
  }

  createCategory(input: CreateCategoryInput): Category {
    const category: Category = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const categoriesMap = this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    categoriesMap[category.id] = category
    this.setItem(STORAGE_KEYS.CATEGORIES, categoriesMap)

    return category
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categoriesMap = this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    const category = categoriesMap[id]

    if (!category) return null

    const updatedCategory: Category = {
      ...category,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    categoriesMap[id] = updatedCategory
    this.setItem(STORAGE_KEYS.CATEGORIES, categoriesMap)

    return updatedCategory
  }

  deleteCategory(id: string): boolean {
    // Move all snippets in this category to uncategorized
    const snippets = this.getSnippetsByCategory(id)
    snippets.forEach((snippet) => {
      this.updateSnippet(snippet.id, { categoryId: null })
    })

    const categoriesMap = this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    if (!categoriesMap[id]) return false

    delete categoriesMap[id]
    this.setItem(STORAGE_KEYS.CATEGORIES, categoriesMap)

    return true
  }

  // ========== Tag Operations ==========

  getAllTags(): Tag[] {
    const tagsMap = this.getItem<Tag>(STORAGE_KEYS.TAGS)
    return Object.values(tagsMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  getTagById(id: string): Tag | null {
    const tagsMap = this.getItem<Tag>(STORAGE_KEYS.TAGS)
    return tagsMap[id] || null
  }

  createTag(input: CreateTagInput): Tag {
    const tag: Tag = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }

    const tagsMap = this.getItem<Tag>(STORAGE_KEYS.TAGS)
    tagsMap[tag.id] = tag
    this.setItem(STORAGE_KEYS.TAGS, tagsMap)

    return tag
  }

  deleteTag(id: string): boolean {
    // Remove tag from all snippets
    const snippets = this.getAllSnippets()
    snippets.forEach((snippet) => {
      if (snippet.tagIds.includes(id)) {
        this.updateSnippet(snippet.id, {
          tagIds: snippet.tagIds.filter((tagId) => tagId !== id),
        })
      }
    })

    const tagsMap = this.getItem<Tag>(STORAGE_KEYS.TAGS)
    if (!tagsMap[id]) return false

    delete tagsMap[id]
    this.setItem(STORAGE_KEYS.TAGS, tagsMap)

    return true
  }

  // ========== Prompt Block Operations ==========

  getAllBlocks(): PromptBlock[] {
    const blocksMap = this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS)
    return Object.values(blocksMap).sort((a, b) => a.order - b.order)
  }

  getBlockById(id: string): PromptBlock | null {
    const blocksMap = this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS)
    return blocksMap[id] || null
  }

  getRootBlocks(): PromptBlock[] {
    return this.getAllBlocks().filter((block) => block.parentId === null)
  }

  getChildBlocks(parentId: string): PromptBlock[] {
    return this.getAllBlocks().filter((block) => block.parentId === parentId)
  }

  getPromptTree(): PromptBlockWithChildren[] {
    const buildTree = (parentId: string | null, depth: number = 0): PromptBlockWithChildren[] => {
      const blocks = this.getAllBlocks().filter((b) => b.parentId === parentId)
      
      return blocks.map((block) => ({
        ...block,
        depth,
        children: buildTree(block.id, depth + 1),
      }))
    }

    return buildTree(null)
  }

  createBlock(input: CreatePromptBlockInput): PromptBlock {
    const block: PromptBlock = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const blocksMap = this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS)
    blocksMap[block.id] = block
    this.setItem(STORAGE_KEYS.PROMPT_BLOCKS, blocksMap)

    // Increment snippet usage if this is a snippet block
    if (block.snippetId) {
      this.incrementSnippetUsage(block.snippetId)
    }

    return block
  }

  updateBlock(id: string, updates: Partial<PromptBlock>): PromptBlock | null {
    const blocksMap = this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS)
    const block = blocksMap[id]

    if (!block) return null

    const updatedBlock: PromptBlock = {
      ...block,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    blocksMap[id] = updatedBlock
    this.setItem(STORAGE_KEYS.PROMPT_BLOCKS, blocksMap)

    return updatedBlock
  }

  deleteBlock(id: string): boolean {
    const block = this.getBlockById(id)
    if (!block) return false

    // Delete all children recursively
    const children = this.getChildBlocks(id)
    children.forEach((child) => this.deleteBlock(child.id))

    // Delete the block itself
    const blocksMap = this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS)
    delete blocksMap[id]
    this.setItem(STORAGE_KEYS.PROMPT_BLOCKS, blocksMap)

    // Reorder siblings
    this.reorderSiblings(block.parentId)

    return true
  }

  moveBlock(blockId: string, newParentId: string | null, newOrder: number): void {
    const block = this.getBlockById(blockId)
    if (!block) return

    const oldParentId = block.parentId
    const oldOrder = block.order

    // Calculate new depth
    let newDepth = 0
    if (newParentId) {
      const newParent = this.getBlockById(newParentId)
      if (newParent) {
        newDepth = newParent.depth + 1
      }
    }

    // Update the block
    this.updateBlock(blockId, {
      parentId: newParentId,
      order: newOrder,
      depth: newDepth,
    })

    // Update depths of all descendants
    this.updateDescendantDepths(blockId, newDepth)

    // Reorder siblings in both old and new parent
    if (oldParentId !== newParentId) {
      this.reorderSiblings(oldParentId)
    }
    this.reorderSiblings(newParentId)
  }

  private updateDescendantDepths(blockId: string, parentDepth: number): void {
    const children = this.getChildBlocks(blockId)
    const newDepth = parentDepth + 1

    children.forEach((child) => {
      this.updateBlock(child.id, { depth: newDepth })
      this.updateDescendantDepths(child.id, newDepth)
    })
  }

  private reorderSiblings(parentId: string | null): void {
    const siblings = this.getAllBlocks()
      .filter((b) => b.parentId === parentId)
      .sort((a, b) => a.order - b.order)

    siblings.forEach((sibling, index) => {
      if (sibling.order !== index) {
        this.updateBlock(sibling.id, { order: index })
      }
    })
  }

  // ========== Settings Operations ==========

  getSettings(): AppSettings {
    if (!this.isBrowser) return DEFAULT_SETTINGS

    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : DEFAULT_SETTINGS
    } catch (error) {
      console.error('Error reading settings:', error)
      return DEFAULT_SETTINGS
    }
  }

  updateSettings(updates: Partial<AppSettings>): AppSettings {
    const currentSettings = this.getSettings()
    const newSettings = { ...currentSettings, ...updates }

    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings))
    }

    return newSettings
  }

  // ========== Metadata Operations ==========

  getMetadata(): StorageMetadata {
    if (!this.isBrowser) {
      const now = new Date().toISOString()
      return {
        version: '1.0.0',
        lastBackup: null,
        installDate: now,
        lastModified: now,
      }
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.METADATA)
      if (data) {
        return JSON.parse(data)
      } else {
        // Initialize metadata
        const metadata: StorageMetadata = {
          version: '1.0.0',
          lastBackup: null,
          installDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata))
        return metadata
      }
    } catch (error) {
      console.error('Error reading metadata:', error)
      const now = new Date().toISOString()
      return {
        version: '1.0.0',
        lastBackup: null,
        installDate: now,
        lastModified: now,
      }
    }
  }

  // ========== Import/Export Operations ==========

  exportAllData(): string {
    const data = {
      snippets: this.getItem<Snippet>(STORAGE_KEYS.SNIPPETS),
      categories: this.getItem<Category>(STORAGE_KEYS.CATEGORIES),
      tags: this.getItem<Tag>(STORAGE_KEYS.TAGS),
      promptBlocks: this.getItem<PromptBlock>(STORAGE_KEYS.PROMPT_BLOCKS),
      settings: this.getSettings(),
      metadata: this.getMetadata(),
    }

    return JSON.stringify(data, null, 2)
  }

  importAllData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString)

      if (data.snippets) this.setItem(STORAGE_KEYS.SNIPPETS, data.snippets)
      if (data.categories) this.setItem(STORAGE_KEYS.CATEGORIES, data.categories)
      if (data.tags) this.setItem(STORAGE_KEYS.TAGS, data.tags)
      if (data.promptBlocks) this.setItem(STORAGE_KEYS.PROMPT_BLOCKS, data.promptBlocks)
      if (data.settings && this.isBrowser) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('Invalid data format')
    }
  }

  clearAllData(): void {
    if (!this.isBrowser) return

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })

    // Reinitialize metadata
    this.getMetadata()
  }
}

// Export singleton instance
export const storageService = new StorageService()
