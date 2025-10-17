"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AttributesEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributes: Record<string, string>
  onSave: (attributes: Record<string, string>) => void
}

export function AttributesEditor({ open, onOpenChange, attributes, onSave }: AttributesEditorProps) {
  const [attrs, setAttrs] = useState<Array<{ key: string; value: string }>>(
    Object.entries(attributes).map(([key, value]) => ({ key, value }))
  )

  const handleAdd = () => {
    setAttrs([...attrs, { key: "", value: "" }])
  }

  const handleRemove = (index: number) => {
    setAttrs(attrs.filter((_, i) => i !== index))
  }

  const handleKeyChange = (index: number, key: string) => {
    const newAttrs = [...attrs]
    newAttrs[index].key = key
    setAttrs(newAttrs)
  }

  const handleValueChange = (index: number, value: string) => {
    const newAttrs = [...attrs]
    newAttrs[index].value = value
    setAttrs(newAttrs)
  }

  const handleSave = () => {
    const attributesObj: Record<string, string> = {}
    attrs.forEach(({ key, value }) => {
      if (key.trim()) {
        attributesObj[key.trim()] = value
      }
    })
    onSave(attributesObj)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit XML Attributes</DialogTitle>
          <DialogDescription>
            Add key-value pairs for XML tag attributes. Example: version="1.0"
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          {attrs.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No attributes yet. Click "Add Attribute" to add one.
            </div>
          ) : (
            attrs.map((attr, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div className="grid gap-2">
                  <Label htmlFor={`key-${index}`}>Key</Label>
                  <Input
                    id={`key-${index}`}
                    placeholder="e.g., version"
                    value={attr.key}
                    onChange={(e) => handleKeyChange(index, e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`value-${index}`}>Value</Label>
                  <Input
                    id={`value-${index}`}
                    placeholder="e.g., 1.0"
                    value={attr.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
          <div className="text-xs text-muted-foreground">
            {attrs.length} attribute{attrs.length !== 1 ? 's' : ''}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Attributes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
