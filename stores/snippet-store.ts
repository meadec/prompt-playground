"use client"

import { create } from "zustand"
import type { Snippet, Category } from "@/types"
import type { CreateSnippetInput, CreateCategoryInput } from "@/lib/validators"
import { storageService } from "@/services/storage.service"

interface SnippetStoreState {
  snippets: Snippet[]
  categories: Category[]
  loading: boolean
  initialized: boolean
  initialize: () => void
  refreshSnippets: () => void
  refreshCategories: () => void
  createSnippet: (input: CreateSnippetInput) => Snippet
  updateSnippet: (id: string, updates: Partial<Snippet>) => Snippet | null
  deleteSnippet: (id: string) => boolean
  toggleFavorite: (id: string) => Snippet | null
  searchSnippets: (query: string) => Snippet[]
  createCategory: (input: CreateCategoryInput) => Category
  updateCategory: (id: string, updates: Partial<Category>) => Category | null
  deleteCategory: (id: string) => boolean
}

function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.order - b.order)
}

export const useSnippetStore = create<SnippetStoreState>((set, get) => ({
  snippets: [],
  categories: [],
  loading: true,
  initialized: false,

  initialize: () => {
    if (get().initialized) return

    set({ loading: true })
    try {
      const snippets = storageService.getAllSnippets()
      const categories = storageService.getAllCategories()
      set({
        snippets,
        categories: sortCategories(categories),
        loading: false,
        initialized: true,
      })
    } catch (error) {
      console.error("Error initializing snippet store:", error)
      set({ loading: false, initialized: true })
    }
  },

  refreshSnippets: () => {
    const snippets = storageService.getAllSnippets()
    set({ snippets })
  },

  refreshCategories: () => {
    const categories = storageService.getAllCategories()
    set({ categories: sortCategories(categories) })
  },

  createSnippet: (input) => {
    const snippet = storageService.createSnippet(input)
    set((state) => ({ snippets: [snippet, ...state.snippets] }))
    return snippet
  },

  updateSnippet: (id, updates) => {
    const updated = storageService.updateSnippet(id, updates)
    if (updated) {
      set((state) => ({
        snippets: state.snippets.map((snippet) =>
          snippet.id === id ? updated : snippet
        ),
      }))
    }
    return updated
  },

  deleteSnippet: (id) => {
    const success = storageService.deleteSnippet(id)
    if (success) {
      set((state) => ({
        snippets: state.snippets.filter((snippet) => snippet.id !== id),
      }))
    }
    return success
  },

  toggleFavorite: (id) => {
    const snippet = get().snippets.find((s) => s.id === id)
    if (!snippet) return null
    return get().updateSnippet(id, { isFavorite: !snippet.isFavorite })
  },

  searchSnippets: (query) => {
    const trimmed = query.trim()
    if (!trimmed) return get().snippets

    const lowerQuery = trimmed.toLowerCase()
    return get().snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.content.toLowerCase().includes(lowerQuery)
    )
  },

  createCategory: (input) => {
    const category = storageService.createCategory(input)
    set((state) => ({ categories: sortCategories([...state.categories, category]) }))
    return category
  },

  updateCategory: (id, updates) => {
    const updated = storageService.updateCategory(id, updates)
    if (updated) {
      set((state) => ({
        categories: sortCategories(
          state.categories.map((category) =>
            category.id === id ? updated : category
          )
        ),
      }))
    }
    return updated
  },

  deleteCategory: (id) => {
    const success = storageService.deleteCategory(id)
    if (success) {
      set((state) => ({
        categories: sortCategories(
          state.categories.filter((category) => category.id !== id)
        ),
        snippets: state.snippets.map((snippet) =>
          snippet.categoryId === id
            ? { ...snippet, categoryId: null }
            : snippet
        ),
      }))
    }
    return success
  },
}))
