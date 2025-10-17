"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
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
import { flattenTree, isDescendant } from "@/lib/utils"
import type { PromptBlock, PromptBlockWithChildren } from "@/types"
import type { CreatePromptBlockInput } from "@/lib/validators"

type DropPosition = 'before' | 'after' | 'inside'

export function PromptBuilder() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<PromptBlock | null>(null)
  const [parentIdForNew, setParentIdForNew] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blockToDelete, setBlockToDelete] = useState<PromptBlockWithChildren | null>(null)
  
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null)

  const { tree, blocks, loading, createBlock, updateBlock, deleteBlock, toggleCollapse, moveBlock } = usePromptBlocks()
  const { snippets } = useSnippets()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const flatBlocks = flattenTree(tree)

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event
    
    if (!over || active.id === over.id) {
      setOverId(null)
      setDropPosition(null)
      return
    }

    setOverId(over.id as string)
    
    const overBlock = blocks.find((b) => b.id === over.id)
    if (!overBlock) return
    
    // Determine drop position based on drag delta
    // If dragging downward significantly, prefer 'after'
    // If dragging upward, prefer 'before'
    // If hovering over a container, prefer 'inside'
    
    if (overBlock.type === 'container' && Math.abs(delta.y) < 10) {
      setDropPosition('inside')
    } else if (delta.y < -5) {
      setDropPosition('before')
    } else {
      setDropPosition('after')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    const currentDropPosition = dropPosition
    
    setActiveId(null)
    setOverId(null)
    setDropPosition(null)

    if (!over || active.id === over.id) return

    const activeBlock = blocks.find((b) => b.id === active.id)
    const overBlock = blocks.find((b) => b.id === over.id)

    if (!activeBlock || !overBlock) return

    // Prevent moving a block into itself or its descendants
    if (isDescendant(overBlock.id, activeBlock.id, blocks)) {
      toast({
        title: "Invalid move",
        description: "Cannot move a block into itself or its descendants",
        variant: "destructive",
      })
      return
    }

    // Determine the new parent and order based on drop position
    let newParentId: string | null
    let newOrder: number

    if (currentDropPosition === 'inside' && overBlock.type === 'container') {
      // Drop inside container - become first child
      newParentId = overBlock.id
      const childrenCount = blocks.filter((b) => b.parentId === overBlock.id).length
      newOrder = 0
    } else if (currentDropPosition === 'before') {
      // Drop before the over block
      newParentId = overBlock.parentId
      newOrder = overBlock.order
    } else {
      // Drop after the over block
      newParentId = overBlock.parentId
      newOrder = overBlock.order + 1
    }

    // Validate that we can drop here
    if (newParentId && currentDropPosition === 'inside') {
      const parent = blocks.find((b) => b.id === newParentId)
      if (!parent || parent.type !== 'container') {
        toast({
          title: "Invalid move",
          description: "Can only drop inside container blocks",
          variant: "destructive",
        })
        return
      }
    }

    // Perform the move
    try {
      moveBlock(activeBlock.id, newParentId, newOrder)
      toast({
        title: "Success",
        description: "Block moved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move block",
        variant: "destructive",
      })
    }
  }

  const renderTree = (nodes: PromptBlockWithChildren[]) => {
    return nodes.map((node) => {
      const snippet = node.snippetId ? snippets.find((s) => s.id === node.snippetId) : null

      return (
        <BlockNode
          key={node.id}
          block={node}
          snippet={snippet}
          snippets={snippets}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleCollapse={toggleCollapse}
          onAddChild={handleAddChild}
          isDragging={activeId === node.id}
          dropPosition={overId === node.id ? dropPosition : null}
        />
      )
    })
  }

  const activeBlock = activeId ? flatBlocks.find((b) => b.id === activeId) : null
  const activeSnippet = activeBlock?.snippetId ? snippets.find((s) => s.id === activeBlock.snippetId) : null

  const hasChildren = blockToDelete && blockToDelete.children && blockToDelete.children.length > 0

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
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
                <SortableContext items={flatBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 pr-4">
                    {renderTree(tree)}
                  </div>
                </SortableContext>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <DragOverlay>
          {activeBlock && (
            <div className="opacity-80">
              <BlockNode
                block={activeBlock}
                snippet={activeSnippet}
                snippets={snippets}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleCollapse={() => {}}
                onAddChild={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
