import { Header } from "@/components/Header"
import { SnippetLibrary } from "@/components/SnippetLibrary/SnippetLibrary"
import { PromptBuilder } from "@/components/PromptBuilder/PromptBuilder"
import { LivePreview } from "@/components/LivePreview/LivePreview"

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      {/* Desktop: 3-panel layout */}
      <main className="hidden lg:grid lg:grid-cols-[25%_45%_30%] gap-4 p-4 h-[calc(100vh-4rem)] overflow-hidden">
        <SnippetLibrary />
        <PromptBuilder />
        <LivePreview />
      </main>

      {/* Tablet: 2-panel layout (to be implemented) */}
      <main className="hidden md:grid lg:hidden md:grid-cols-[60%_40%] gap-4 p-4 h-[calc(100vh-4rem)] overflow-hidden">
        <PromptBuilder />
        <LivePreview />
      </main>

      {/* Mobile: Tab-based layout (to be implemented) */}
      <main className="md:hidden flex flex-col h-[calc(100vh-4rem)]">
        <div className="text-center p-8 text-muted-foreground">
          Mobile view coming soon...
        </div>
      </main>
    </div>
  )
}
