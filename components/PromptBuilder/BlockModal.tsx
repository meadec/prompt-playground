"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PromptBlock, BlockType } from "@/types"
import type { CreatePromptBlockInput } from "@/lib/validators"
import { useSnippets } from "@/hooks/use-snippets"

interface BlockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreatePromptBlockInput) => void
  block?: PromptBlock | null
  parentId?: string | null
}

export function BlockModal({ open, onOpenChange, onSave, block, parentId = null }: BlockModalProps) {
  const { snippets } = useSnippets()
  const [type, setType] = useState<BlockType>('text')
  const [xmlTag, setXmlTag] = useState("")
  const [content, setContent] = useState("")
  const [snippetId, setSnippetId] = useState<string | null>(null)

  useEffect(() => {
    if (block) {
      setType(block.type)
      setXmlTag(block.xmlTag || "")
      setContent(block.content)
      setSnippetId(block.snippetId)
    } else {
      setType('text')
      setXmlTag("")
      setContent("")
      setSnippetId(null)
    }
  }, [block, open])

  const handleSave = () => {
    // Calculate order (append to end of siblings)
    const order = 0 // Will be handled by storage service

    // Calculate depth
    let depth = 0
    if (parentId) {
      // This will be calculated properly by the storage service
      depth = 0
    }

    const input: CreatePromptBlockInput = {
      type,
      content: type === 'text' ? content : '',
      snippetId: type === 'snippet' ? snippetId : null,
      xmlTag: xmlTag.trim() || null,
      xmlAttributes: {},
      parentId: parentId || null,
      order,
      depth,
      isCollapsed: false,
    }

    onSave(input)
    onOpenChange(false)
    
    // Reset form
    setType('text')
    setXmlTag("")
    setContent("")
    setSnippetId(null)
  }

  const isValid = () => {
    if (type === 'text') return content.trim().length > 0
    if (type === 'snippet') return snippetId !== null
    if (type === 'container') return xmlTag.trim().length > 0
    return false
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{block ? "Edit Block" : "New Block"}</DialogTitle>
          <DialogDescription>
            {block ? "Edit your block details below." : "Create a new block for your prompt structure."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Block Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as BlockType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Block</SelectItem>
                <SelectItem value="container">Container (XML)</SelectItem>
                <SelectItem value="snippet">Snippet Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="xmlTag">XML Tag {type === 'container' ? '(Required)' : '(Optional)'}</Label>
            <Input
              id="xmlTag"
              placeholder="e.g., system, role, constraints"
              value={xmlTag}
              onChange={(e) => setXmlTag(e.target.value)}
            />
          </div>

          {type === 'text' && (
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter your text content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          )}

          {type === 'snippet' && (
            <div className="grid gap-2">
              <Label htmlFor="snippet">Select Snippet</Label>
              <Select value={snippetId || "none"} onValueChange={(val) => setSnippetId(val === "none" ? null : val)}>
                <SelectTrigger id="snippet">
                  <SelectValue placeholder="Choose a snippet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Snippet</SelectItem>
                  {snippets.map((snippet) => (
                    <SelectItem key={snippet.id} value={snippet.id}>
                      {snippet.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'container' && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <p className="font-medium mb-1">Container Block</p>
              <p className="text-xs">
                Container blocks can have child blocks nested inside them. Use the XML tag to define the structure.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid()}>
            {block ? "Save Changes" : "Create Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
