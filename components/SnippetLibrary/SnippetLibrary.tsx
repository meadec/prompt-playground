"use client"

import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { SnippetCard } from "./SnippetCard"
import { SnippetModal } from "./SnippetModal"
import { useSnippets } from "@/hooks/use-snippets"
import { useCategories } from "@/hooks/use-categories"
import { useToast } from "@/hooks/use-toast"
import type { Snippet } from "@/types"
import type { CreateSnippetInput } from "@/lib/validators"

export function SnippetLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snippetToDelete, setSnippetToDelete] = useState<Snippet | null>(null)

  const { snippets, loading, createSnippet, updateSnippet, deleteSnippet, toggleFavorite } = useSnippets()
  const { categories } = useCategories()
  const { toast } = useToast()

  const filteredSnippets = useMemo(() => {
    if (!searchQuery.trim()) return snippets

    const query = searchQuery.toLowerCase()
    return snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.content.toLowerCase().includes(query)
    )
  }, [snippets, searchQuery])

  const handleCreateNew = () => {
    setEditingSnippet(null)
    setModalOpen(true)
  }

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setModalOpen(true)
  }

  const handleSave = (input: CreateSnippetInput) => {
    if (editingSnippet) {
      updateSnippet(editingSnippet.id, input)
      toast({
        title: "Success",
        description: "Snippet updated successfully",
      })
    } else {
      createSnippet(input)
      toast({
        title: "Success",
        description: "Snippet created successfully",
      })
    }
  }

  const handleDeleteClick = (snippet: Snippet) => {
    setSnippetToDelete(snippet)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!snippetToDelete) return

    try {
      deleteSnippet(snippetToDelete.id)
      toast({
        title: "Success",
        description: "Snippet deleted successfully",
      })
      setDeleteDialogOpen(false)
      setSnippetToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete snippet",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = (snippet: Snippet) => {
    toggleFavorite(snippet.id)
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Snippet Library</CardTitle>
            <Button size="sm" className="h-8" onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Separator className="mb-4" />

          {/* Snippet List */}
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Loading snippets...
              </div>
            ) : filteredSnippets.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <div className="mb-2">
                  {searchQuery ? "No snippets found" : "No snippets yet"}
                </div>
                {!searchQuery && (
                  <div className="text-xs">Click "New" to create one.</div>
                )}
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    category={categories.find((c) => c.id === snippet.categoryId)}
                    onEdit={() => handleEdit(snippet)}
                    onDelete={() => handleDeleteClick(snippet)}
                    onToggleFavorite={() => handleToggleFavorite(snippet)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <SnippetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        snippet={editingSnippet}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snippet?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{snippetToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
