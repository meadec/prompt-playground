"use client"

import { ChevronDown, ChevronRight, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PromptBlockWithChildren, Snippet } from "@/types"
import { cn } from "@/lib/utils"

interface BlockNodeProps {
  block: PromptBlockWithChildren
  snippet?: Snippet | null
  snippets?: Snippet[]
  onEdit: (block: PromptBlockWithChildren) => void
  onDelete: (block: PromptBlockWithChildren) => void
  onToggleCollapse: (blockId: string) => void
  onAddChild: (parentId: string) => void
}

export function BlockNode({
  block,
  snippet,
  snippets = [],
  onEdit,
  onDelete,
  onToggleCollapse,
  onAddChild,
}: BlockNodeProps) {
  const hasChildren = block.children && block.children.length > 0
  const isContainer = block.type === 'container'

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "group relative p-3 rounded-lg border bg-block-container hover:border-primary transition-colors",
          block.isCollapsed && hasChildren && "border-l-4 border-l-primary"
        )}
        style={{ marginLeft: `${block.depth * 20}px` }}
      >
        <div className="flex items-start gap-2">
          {/* Collapse Toggle */}
          {isContainer && hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => onToggleCollapse(block.id)}
            >
              {block.isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* XML Tag */}
            {block.xmlTag && (
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-mono text-syntax-tag">
                  &lt;{block.xmlTag}
                  {Object.keys(block.xmlAttributes).length > 0 && (
                    <span className="text-syntax-attribute">
                      {Object.entries(block.xmlAttributes).map(([key, value]) => (
                        <span key={key}>
                          {' '}
                          {key}=<span className="text-syntax-value">"{value}"</span>
                        </span>
                      ))}
                    </span>
                  )}
                  &gt;
                </code>
                {isContainer && (
                  <Badge variant="outline" className="text-xs">
                    Container
                  </Badge>
                )}
              </div>
            )}

            {/* Block Type Badge */}
            {block.type === 'snippet' && snippet && (
              <Badge variant="secondary" className="mb-1 text-xs">
                📎 {snippet.title}
              </Badge>
            )}

            {/* Content Preview */}
            {block.type === 'text' && block.content && (
              <p className="text-sm text-muted-foreground font-mono line-clamp-2">
                {block.content}
              </p>
            )}

            {block.type === 'snippet' && snippet && (
              <p className="text-sm text-muted-foreground font-mono line-clamp-2 italic">
                {snippet.content}
              </p>
            )}

            {/* Closing Tag */}
            {block.xmlTag && !block.isCollapsed && (
              <code className="text-sm font-mono text-syntax-tag/70 mt-1 block">
                &lt;/{block.xmlTag}&gt;
              </code>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {isContainer && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onAddChild(block.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(block)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(block)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Children */}
      {!block.isCollapsed && hasChildren && (
        <div className="space-y-2">
          {block.children.map((child) => {
            // Look up each child's snippet
            const childSnippet = child.snippetId ? snippets.find((s) => s.id === child.snippetId) : null
            return (
              <BlockNode
                key={child.id}
                block={child}
                snippet={childSnippet}
                snippets={snippets}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleCollapse={onToggleCollapse}
                onAddChild={onAddChild}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
