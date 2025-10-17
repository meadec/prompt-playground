"use client"

import { useEffect } from "react"
import { shallow } from "zustand/shallow"
import { usePromptBlockStore } from "@/stores/prompt-block-store"

export function usePromptBlocks() {
  const {
    blocks,
    tree,
    loading,
    createBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    toggleCollapse,
    refresh,
  } = usePromptBlockStore(
    (state) => ({
      blocks: state.blocks,
      tree: state.tree,
      loading: state.loading,
      createBlock: state.createBlock,
      updateBlock: state.updateBlock,
      deleteBlock: state.deleteBlock,
      moveBlock: state.moveBlock,
      toggleCollapse: state.toggleCollapse,
      refresh: state.refresh,
    }),
    shallow
  )

  useEffect(() => {
    usePromptBlockStore.getState().initialize()
  }, [])

  return {
    blocks,
    tree,
    loading,
    createBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    toggleCollapse,
    refresh,
  }
}
