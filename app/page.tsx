"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { SnippetLibrary } from "@/components/SnippetLibrary/SnippetLibrary"
import { PromptBuilder } from "@/components/PromptBuilder/PromptBuilder"
import { LivePreview } from "@/components/LivePreview/LivePreview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit3, Eye, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Home() {
  const [mobileTab, setMobileTab] = useState("builder")

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      {/* Desktop: 3-panel layout (≥1024px) */}
      <main className="hidden lg:grid lg:grid-cols-[25%_45%_30%] gap-4 p-4 h-[calc(100vh-4rem)] overflow-hidden">
        <SnippetLibrary />
        <PromptBuilder />
        <LivePreview />
      </main>

      {/* Tablet: 2-panel with drawer (768px - 1023px) */}
      <main className="hidden md:grid lg:hidden md:grid-cols-[60%_40%] gap-4 p-4 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex flex-col gap-4">
          {/* Snippet drawer for tablet */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4 mr-2" />
                  Snippets
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] sm:w-[400px] p-0">
                <div className="h-full pt-6">
                  <SnippetLibrary />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 overflow-hidden">
            <PromptBuilder />
          </div>
        </div>
        <LivePreview />
      </main>

      {/* Mobile: Tab-based layout (<768px) */}
      <main className="md:hidden flex flex-col h-[calc(100vh-4rem)]">
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="flex flex-col h-full">
          {/* Tab Content (Full Screen) */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="snippets" className="h-full m-0 p-2">
              <SnippetLibrary />
            </TabsContent>
            
            <TabsContent value="builder" className="h-full m-0 p-2">
              <PromptBuilder />
            </TabsContent>
            
            <TabsContent value="preview" className="h-full m-0 p-2">
              <LivePreview />
            </TabsContent>
          </div>

          {/* Bottom Tab Bar */}
          <TabsList className="w-full h-16 rounded-none border-t grid grid-cols-3 bg-background">
            <TabsTrigger 
              value="snippets" 
              className="flex-col gap-1 data-[state=active]:bg-muted"
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">Snippets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="builder" 
              className="flex-col gap-1 data-[state=active]:bg-muted"
            >
              <Edit3 className="h-5 w-5" />
              <span className="text-xs">Builder</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex-col gap-1 data-[state=active]:bg-muted"
            >
              <Eye className="h-5 w-5" />
              <span className="text-xs">Preview</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  )
}
