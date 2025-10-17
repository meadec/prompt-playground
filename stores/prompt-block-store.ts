"use client"

import { create } from "zustand"
import type { PromptBlock, PromptBlockWithChildren } from "@/types"
import type { CreatePromptBlockInput } from "@/lib/validators"
import { storageService } from "@/services/storage.service"

interface PromptBlockStoreState {
  blocks: PromptBlock[]
  tree: PromptBlockWithChildren[]
  loading: boolean
  initialized: boolean
  initialize: () => void
  refresh: () => void
  createBlock: (input: CreatePromptBlockInput) => PromptBlock
  updateBlock: (id: string, updates: Partial<PromptBlock>) => PromptBlock | null
  deleteBlock: (id: string) => boolean
  moveBlock: (blockId: string, newParentId: string | null, newOrder: number) => void
  toggleCollapse: (id: string) => PromptBlock | null
}

export const usePromptBlockStore = create<PromptBlockStoreState>((set, get) => {
  const syncState = () => {
    const blocks = storageService.getAllBlocks()
    const tree = storageService.getPromptTree()
    set({ blocks, tree, loading: false })
  }

  return {
    blocks: [],
    tree: [],
    loading: true,
    initialized: false,

    initialize: () => {
      if (get().initialized) return

      set({ loading: true })
      try {
        syncState()
      } catch (error) {
        console.error("Error initializing prompt block store:", error)
        set({ loading: false })
      } finally {
        set({ initialized: true })
      }
    },

    refresh: () => {
      try {
        syncState()
      } catch (error) {
        console.error("Error refreshing prompt blocks:", error)
      }
    },

    createBlock: (input) => {
      const block = storageService.createBlock(input)
      syncState()
      return block
    },

    updateBlock: (id, updates) => {
      const updated = storageService.updateBlock(id, updates)
      if (updated) {
        syncState()
      }
      return updated
    },

    deleteBlock: (id) => {
      const success = storageService.deleteBlock(id)
      if (success) {
        syncState()
      }
      return success
    },

    moveBlock: (blockId, newParentId, newOrder) => {
      storageService.moveBlock(blockId, newParentId, newOrder)
      syncState()
    },

    toggleCollapse: (id) => {
      const block = get().blocks.find((b) => b.id === id)
      if (!block) return null

      const updated = storageService.updateBlock(id, {
        isCollapsed: !block.isCollapsed,
      })

      if (updated) {
        syncState()
      }

      return updated
    },
  }
})
