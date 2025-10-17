"use client"

import { useState } from "react"
import { Copy, Download, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { XmlRenderer } from "./XmlRenderer"
import { usePromptBlocks } from "@/hooks/use-prompt-blocks"
import { useSnippets } from "@/hooks/use-snippets"
import { useToast } from "@/hooks/use-toast"
import { generateXml, downloadAsFile } from "@/lib/xml-generator"

export function LivePreview() {
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  
  const { tree } = usePromptBlocks()
  const { snippets } = useSnippets()
  const { toast } = useToast()

  const handleCopy = async () => {
    const xml = generateXml(tree, snippets, { indentSize, showLineNumbers: false })
    
    if (!xml.trim()) {
      toast({
        title: "Nothing to copy",
        description: "Add some blocks first",
        variant: "destructive",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(xml)
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownloadTxt = () => {
    const xml = generateXml(tree, snippets, { indentSize, showLineNumbers: false })
    
    if (!xml.trim()) {
      toast({
        title: "Nothing to download",
        description: "Add some blocks first",
        variant: "destructive",
      })
      return
    }

    downloadAsFile(xml, 'prompt', 'txt')
    toast({
      title: "Downloaded",
      description: "Prompt saved as prompt.txt",
    })
  }

  const handleDownloadXml = () => {
    const xml = generateXml(tree, snippets, { indentSize, showLineNumbers: false })
    
    if (!xml.trim()) {
      toast({
        title: "Nothing to download",
        description: "Add some blocks first",
        variant: "destructive",
      })
      return
    }

    downloadAsFile(xml, 'prompt', 'xml')
    toast({
      title: "Downloaded",
      description: "Prompt saved as prompt.xml",
    })
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Preview Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers" className="text-sm">
                      Line Numbers
                    </Label>
                    <Switch
                      id="line-numbers"
                      checked={showLineNumbers}
                      onCheckedChange={setShowLineNumbers}
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Indent Size</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIndentSize(2)}>
                  2 spaces {indentSize === 2 && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIndentSize(4)}>
                  4 spaces {indentSize === 4 && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadTxt}>
                  Download as .txt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadXml}>
                  Download as .xml
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
            <XmlRenderer
              tree={tree}
              snippets={snippets}
              indentSize={indentSize}
              showLineNumbers={showLineNumbers}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
