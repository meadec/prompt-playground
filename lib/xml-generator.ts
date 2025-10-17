import type { PromptBlockWithChildren, Snippet } from '@/types'

export interface XmlGeneratorOptions {
  indentSize: number
  showLineNumbers: boolean
}

export function generateXml(
  tree: PromptBlockWithChildren[],
  snippets: Snippet[],
  options: XmlGeneratorOptions = { indentSize: 2, showLineNumbers: false }
): string {
  const lines: string[] = []

  const generateBlock = (block: PromptBlockWithChildren, depth: number = 0) => {
    const indent = ' '.repeat(depth * options.indentSize)
    
    // Opening tag
    if (block.xmlTag) {
      let tag = `${indent}<${block.xmlTag}`
      
      // Add attributes
      if (Object.keys(block.xmlAttributes).length > 0) {
        Object.entries(block.xmlAttributes).forEach(([key, value]) => {
          tag += ` ${key}="${value}"`
        })
      }
      
      tag += '>'
      lines.push(tag)
    }

    // Content
    if (block.type === 'text' && block.content) {
      const contentIndent = block.xmlTag ? ' '.repeat((depth + 1) * options.indentSize) : indent
      lines.push(`${contentIndent}${block.content}`)
    } else if (block.type === 'snippet' && block.snippetId) {
      const snippet = snippets.find((s) => s.id === block.snippetId)
      if (snippet) {
        const contentIndent = block.xmlTag ? ' '.repeat((depth + 1) * options.indentSize) : indent
        // Split snippet content by lines and indent each
        const snippetLines = snippet.content.split('\n')
        snippetLines.forEach((line) => {
          lines.push(`${contentIndent}${line}`)
        })
      }
    }

    // Children (for containers)
    if (block.type === 'container' && block.children && block.children.length > 0) {
      block.children.forEach((child) => {
        generateBlock(child, block.xmlTag ? depth + 1 : depth)
      })
    }

    // Closing tag
    if (block.xmlTag) {
      lines.push(`${indent}</${block.xmlTag}>`)
    }
  }

  // Generate all root blocks
  tree.forEach((block) => {
    generateBlock(block, 0)
  })

  // Add line numbers if needed
  if (options.showLineNumbers) {
    return lines
      .map((line, index) => {
        const lineNum = String(index + 1).padStart(3, ' ')
        return `${lineNum} | ${line}`
      })
      .join('\n')
  }

  return lines.join('\n')
}

export function generatePlainText(tree: PromptBlockWithChildren[], snippets: Snippet[]): string {
  return generateXml(tree, snippets, { indentSize: 2, showLineNumbers: false })
}

export function downloadAsFile(content: string, filename: string, type: 'txt' | 'xml' = 'txt') {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${type}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
