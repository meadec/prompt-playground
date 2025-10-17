"use client"

import { useEffect } from "react"
import { shallow } from "zustand/shallow"
import { useSnippetStore } from "@/stores/snippet-store"

export function useSnippets() {
  const {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    searchSnippets,
    toggleFavorite,
    refreshSnippets,
  } = useSnippetStore(
    (state) => ({
      snippets: state.snippets,
      loading: state.loading,
      createSnippet: state.createSnippet,
      updateSnippet: state.updateSnippet,
      deleteSnippet: state.deleteSnippet,
      searchSnippets: state.searchSnippets,
      toggleFavorite: state.toggleFavorite,
      refreshSnippets: state.refreshSnippets,
    }),
    shallow
  )

  useEffect(() => {
    useSnippetStore.getState().initialize()
  }, [])

  return {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    searchSnippets,
    toggleFavorite,
    refresh: refreshSnippets,
  }
}
