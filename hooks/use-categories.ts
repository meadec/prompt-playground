"use client"

import { useEffect } from "react"
import { shallow } from "zustand/shallow"
import { useSnippetStore } from "@/stores/snippet-store"

export function useCategories() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  } = useSnippetStore(
    (state) => ({
      categories: state.categories,
      loading: state.loading,
      createCategory: state.createCategory,
      updateCategory: state.updateCategory,
      deleteCategory: state.deleteCategory,
      refreshCategories: state.refreshCategories,
    }),
    shallow
  )

  useEffect(() => {
    useSnippetStore.getState().initialize()
  }, [])

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: refreshCategories,
  }
}
