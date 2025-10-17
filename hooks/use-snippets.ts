"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Snippet } from '@/types'
import type { CreateSnippetInput } from '@/lib/validators'
import { storageService } from '@/services/storage.service'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  const loadSnippets = useCallback(() => {
    setLoading(true)
    try {
      const data = storageService.getAllSnippets()
      setSnippets(data)
    } catch (error) {
      console.error('Error loading snippets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSnippets()
  }, [loadSnippets])

  const createSnippet = useCallback((input: CreateSnippetInput) => {
    const newSnippet = storageService.createSnippet(input)
    setSnippets((prev) => [newSnippet, ...prev])
    return newSnippet
  }, [])

  const updateSnippet = useCallback((id: string, updates: Partial<Snippet>) => {
    const updated = storageService.updateSnippet(id, updates)
    if (updated) {
      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      )
    }
    return updated
  }, [])

  const deleteSnippet = useCallback((id: string) => {
    try {
      const success = storageService.deleteSnippet(id)
      if (success) {
        setSnippets((prev) => prev.filter((s) => s.id !== id))
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const searchSnippets = useCallback((query: string) => {
    return storageService.searchSnippets(query)
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    const snippet = snippets.find((s) => s.id === id)
    if (snippet) {
      return updateSnippet(id, { isFavorite: !snippet.isFavorite })
    }
    return null
  }, [snippets, updateSnippet])

  return {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    searchSnippets,
    toggleFavorite,
    refresh: loadSnippets,
  }
}
