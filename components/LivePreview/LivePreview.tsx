"use client"

import { Copy, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function LivePreview() {
  const { toast } = useToast()

  const handleCopy = () => {
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download",
      description: "Download functionality coming soon...",
    })
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="h-8" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
        <Separator className="mb-4" />

        {/* Preview Area */}
        <ScrollArea className="flex-1">
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
            <div className="text-muted-foreground">
              <div className="mb-4">Your XML prompt will appear here...</div>
              <pre className="text-xs opacity-50">
{`<system_prompt>
  <role>
    Your prompt content...
  </role>
</system_prompt>`}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
