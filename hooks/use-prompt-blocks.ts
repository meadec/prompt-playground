"use client"

import { useState, useEffect, useCallback } from 'react'
import type { PromptBlock, PromptBlockWithChildren } from '@/types'
import type { CreatePromptBlockInput } from '@/lib/validators'
import { storageService } from '@/services/storage.service'

export function usePromptBlocks() {
  const [blocks, setBlocks] = useState<PromptBlock[]>([])
  const [tree, setTree] = useState<PromptBlockWithChildren[]>([])
  const [loading, setLoading] = useState(true)

  const loadBlocks = useCallback(() => {
    setLoading(true)
    try {
      const data = storageService.getAllBlocks()
      const treeData = storageService.getPromptTree()
      setBlocks(data)
      setTree(treeData)
    } catch (error) {
      console.error('Error loading blocks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBlocks()
  }, [loadBlocks])

  const createBlock = useCallback((input: CreatePromptBlockInput) => {
    const newBlock = storageService.createBlock(input)
    loadBlocks() // Reload to get updated tree
    return newBlock
  }, [loadBlocks])

  const updateBlock = useCallback((id: string, updates: Partial<PromptBlock>) => {
    const updated = storageService.updateBlock(id, updates)
    if (updated) {
      loadBlocks()
    }
    return updated
  }, [loadBlocks])

  const deleteBlock = useCallback((id: string) => {
    const success = storageService.deleteBlock(id)
    if (success) {
      loadBlocks()
    }
    return success
  }, [loadBlocks])

  const moveBlock = useCallback((blockId: string, newParentId: string | null, newOrder: number) => {
    storageService.moveBlock(blockId, newParentId, newOrder)
    loadBlocks()
  }, [loadBlocks])

  const toggleCollapse = useCallback((id: string) => {
    const block = blocks.find((b) => b.id === id)
    if (block) {
      updateBlock(id, { isCollapsed: !block.isCollapsed })
    }
  }, [blocks, updateBlock])

  return {
    blocks,
    tree,
    loading,
    createBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    toggleCollapse,
    refresh: loadBlocks,
  }
}
