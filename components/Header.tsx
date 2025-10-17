"use client"

import { useRef, useState } from "react"
import { Moon, Sun, Download, Upload, Settings, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { storageService } from "@/services/storage.service"

export function Header() {
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const handleExport = () => {
    try {
      const data = storageService.exportAllData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prompt-engineer-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Exported!",
        description: "Your data has been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        storageService.importAllData(content)
        
        // Reload the page to reflect imported data
        window.location.reload()

        toast({
          title: "Imported!",
          description: "Your data has been imported successfully",
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid data format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset input
    event.target.value = ''
  }

  const handleClearAll = () => {
    setClearDialogOpen(true)
  }

  const handleClearConfirm = () => {
    try {
      storageService.clearAllData()
      window.location.reload()

      toast({
        title: "Cleared",
        description: "All data has been cleared",
      })
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear data",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <header className="border-b bg-card">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">✨</div>
            <h1 className="text-xl font-bold">Prompt Engineer</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Data Management</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearAll} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all snippets, categories, tags, and prompt blocks. 
              This action cannot be undone. Consider exporting your data first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
