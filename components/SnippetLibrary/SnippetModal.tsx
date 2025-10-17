"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Snippet } from "@/types"
import type { CreateSnippetInput } from "@/lib/validators"
import { useCategories } from "@/hooks/use-categories"

interface SnippetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreateSnippetInput) => void
  snippet?: Snippet | null
}

export function SnippetModal({ open, onOpenChange, onSave, snippet }: SnippetModalProps) {
  const { categories } = useCategories()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState<string | null>(null)

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title)
      setContent(snippet.content)
      setCategoryId(snippet.categoryId)
    } else {
      setTitle("")
      setContent("")
      setCategoryId(null)
    }
  }, [snippet, open])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    onSave({
      title: title.trim(),
      content: content.trim(),
      categoryId,
      tagIds: [],
      isFavorite: false,
      usageCount: 0,
    })

    setTitle("")
    setContent("")
    setCategoryId(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{snippet ? "Edit Snippet" : "New Snippet"}</DialogTitle>
          <DialogDescription>
            {snippet ? "Edit your snippet details below." : "Create a new reusable snippet for your prompts."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter snippet title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter snippet content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={categoryId || "none"} onValueChange={(val) => setCategoryId(val === "none" ? null : val)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim()}>
            {snippet ? "Save Changes" : "Create Snippet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
