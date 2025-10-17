"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { BlockNode } from "./BlockNode"
import { BlockModal } from "./BlockModal"
import { usePromptBlocks } from "@/hooks/use-prompt-blocks"
import { useSnippets } from "@/hooks/use-snippets"
import { useToast } from "@/hooks/use-toast"
import type { PromptBlock, PromptBlockWithChildren } from "@/types"
import type { CreatePromptBlockInput } from "@/lib/validators"

export function PromptBuilder() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<PromptBlock | null>(null)
  const [parentIdForNew, setParentIdForNew] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blockToDelete, setBlockToDelete] = useState<PromptBlockWithChildren | null>(null)

  const { tree, loading, createBlock, updateBlock, deleteBlock, toggleCollapse } = usePromptBlocks()
  const { snippets } = useSnippets()
  const { toast } = useToast()

  const handleAddRoot = () => {
    setEditingBlock(null)
    setParentIdForNew(null)
    setModalOpen(true)
  }

  const handleAddChild = (parentId: string) => {
    setEditingBlock(null)
    setParentIdForNew(parentId)
    setModalOpen(true)
  }

  const handleEdit = (block: PromptBlockWithChildren) => {
    setEditingBlock(block)
    setParentIdForNew(block.parentId)
    setModalOpen(true)
  }

  const handleSave = (input: CreatePromptBlockInput) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, input)
      toast({
        title: "Success",
        description: "Block updated successfully",
      })
    } else {
      createBlock(input)
      toast({
        title: "Success",
        description: "Block created successfully",
      })
    }
  }

  const handleDeleteClick = (block: PromptBlockWithChildren) => {
    setBlockToDelete(block)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!blockToDelete) return

    deleteBlock(blockToDelete.id)
    toast({
      title: "Success",
      description: "Block deleted successfully",
    })
    setDeleteDialogOpen(false)
    setBlockToDelete(null)
  }

  const renderTree = (nodes: PromptBlockWithChildren[]) => {
    return nodes.map((node) => {
      const snippet = node.snippetId ? snippets.find((s) => s.id === node.snippetId) : null

      return (
        <BlockNode
          key={node.id}
          block={node}
          snippet={snippet}
          onEdit={() => handleEdit(node)}
          onDelete={() => handleDeleteClick(node)}
          onToggleCollapse={() => toggleCollapse(node.id)}
          onAddChild={() => handleAddChild(node.id)}
        />
      )
    })
  }

  const hasChildren = blockToDelete && blockToDelete.children && blockToDelete.children.length > 0

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Prompt Builder</CardTitle>
            <Button size="sm" variant="outline" className="h-8" onClick={handleAddRoot}>
              <Plus className="h-4 w-4 mr-1" />
              Add Block
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
          <Separator className="mb-4" />

          {/* Tree View */}
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                Loading blocks...
              </div>
            ) : tree.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                <div className="mb-2">Your prompt structure will appear here</div>
                <div className="text-xs">Click "Add Block" to start building</div>
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {renderTree(tree)}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <BlockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        block={editingBlock}
        parentId={parentIdForNew}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Block?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasChildren ? (
                <>
                  This block has {blockToDelete.children.length} child block(s). 
                  Deleting it will also delete all children. This action cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this block? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete {hasChildren && `(and ${blockToDelete.children.length} children)`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
