"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Category } from '@/types'
import type { CreateCategoryInput } from '@/lib/validators'
import { storageService } from '@/services/storage.service'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const loadCategories = useCallback(() => {
    setLoading(true)
    try {
      const data = storageService.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const createCategory = useCallback((input: CreateCategoryInput) => {
    const newCategory = storageService.createCategory(input)
    setCategories((prev) => [...prev, newCategory].sort((a, b) => a.order - b.order))
    return newCategory
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    const updated = storageService.updateCategory(id, updates)
    if (updated) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.order - b.order)
      )
    }
    return updated
  }, [])

  const deleteCategory = useCallback((id: string) => {
    const success = storageService.deleteCategory(id)
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
    return success
  }, [])

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories,
  }
}
