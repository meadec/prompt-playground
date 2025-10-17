"use client"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function PromptBuilder() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Prompt Builder</CardTitle>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Add Block
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
        <Separator className="mb-4" />

        {/* Tree View */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            <div className="text-center py-16 text-sm text-muted-foreground">
              <div className="mb-2">Your prompt structure will appear here</div>
              <div className="text-xs">Click "Add Block" to start building</div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
