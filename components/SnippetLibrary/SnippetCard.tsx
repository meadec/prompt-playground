"use client"

import { Star, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Snippet, Category } from "@/types"
import { truncate } from "@/lib/utils"
import { MAX_SNIPPET_PREVIEW_LENGTH } from "@/lib/constants"

interface SnippetCardProps {
  snippet: Snippet
  category?: Category | null
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}

export function SnippetCard({
  snippet,
  category,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SnippetCardProps) {
  return (
    <div className="group relative p-3 rounded-lg border bg-snippet-card hover:bg-snippet-hover transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{snippet.title}</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onToggleFavorite}
          >
            <Star
              className={`h-4 w-4 ${
                snippet.isFavorite ? "fill-warning text-warning" : "text-muted-foreground"
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-2 font-mono">
        {truncate(snippet.content, MAX_SNIPPET_PREVIEW_LENGTH)}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {category && (
          <Badge variant="secondary" className="text-xs">
            {category.name}
          </Badge>
        )}
        {snippet.usageCount > 0 && (
          <Badge variant="outline" className="text-xs">
            Used {snippet.usageCount}x
          </Badge>
        )}
      </div>
    </div>
  )
}
