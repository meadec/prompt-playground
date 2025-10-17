"use client"

import { useMemo } from "react"
import type { PromptBlockWithChildren, Snippet } from "@/types"

interface XmlRendererProps {
  tree: PromptBlockWithChildren[]
  snippets: Snippet[]
  indentSize: number
  showLineNumbers: boolean
}

export function XmlRenderer({ tree, snippets, indentSize, showLineNumbers }: XmlRendererProps) {
  const renderedLines = useMemo(() => {
    const lines: JSX.Element[] = []
    let lineNumber = 1

    const renderBlock = (block: PromptBlockWithChildren, depth: number = 0) => {
      const indent = '\u00A0'.repeat(depth * indentSize) // Non-breaking spaces

      // Opening tag
      if (block.xmlTag) {
        const lineNum = showLineNumbers ? (
          <span className="text-muted-foreground select-none mr-4 inline-block w-8 text-right">
            {lineNumber}
          </span>
        ) : null

        lines.push(
          <div key={`${block.id}-open`} className="leading-relaxed">
            {lineNum}
            <span className="whitespace-pre">{indent}</span>
            <span className="text-syntax-tag">&lt;{block.xmlTag}</span>
            {Object.entries(block.xmlAttributes).map(([key, value]) => (
              <span key={key}>
                <span className="text-syntax-attribute"> {key}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-syntax-value">"{value}"</span>
              </span>
            ))}
            <span className="text-syntax-tag">&gt;</span>
          </div>
        )
        lineNumber++
      }

      // Content
      if (block.type === 'text' && block.content) {
        const contentIndent = block.xmlTag ? '\u00A0'.repeat((depth + 1) * indentSize) : indent
        const contentLines = block.content.split('\n')
        
        contentLines.forEach((line, idx) => {
          const lineNum = showLineNumbers ? (
            <span className="text-muted-foreground select-none mr-4 inline-block w-8 text-right">
              {lineNumber}
            </span>
          ) : null

          lines.push(
            <div key={`${block.id}-content-${idx}`} className="leading-relaxed">
              {lineNum}
              <span className="whitespace-pre">{contentIndent}</span>
              <span className="text-syntax-text">{line}</span>
            </div>
          )
          lineNumber++
        })
      } else if (block.type === 'snippet' && block.snippetId) {
        const snippet = snippets.find((s) => s.id === block.snippetId)
        if (snippet) {
          const contentIndent = block.xmlTag ? '\u00A0'.repeat((depth + 1) * indentSize) : indent
          const snippetLines = snippet.content.split('\n')
          
          snippetLines.forEach((line, idx) => {
            const lineNum = showLineNumbers ? (
              <span className="text-muted-foreground select-none mr-4 inline-block w-8 text-right">
                {lineNumber}
              </span>
            ) : null

            lines.push(
              <div key={`${block.id}-snippet-${idx}`} className="leading-relaxed">
                {lineNum}
                <span className="whitespace-pre">{contentIndent}</span>
                <span className="text-syntax-text italic">{line}</span>
              </div>
            )
            lineNumber++
          })
        }
      }

      // Children
      if (block.children && block.children.length > 0) {
        block.children.forEach((child) => {
          renderBlock(child, block.xmlTag ? depth + 1 : depth)
        })
      }

      // Closing tag
      if (block.xmlTag) {
        const lineNum = showLineNumbers ? (
          <span className="text-muted-foreground select-none mr-4 inline-block w-8 text-right">
            {lineNumber}
          </span>
        ) : null

        lines.push(
          <div key={`${block.id}-close`} className="leading-relaxed">
            {lineNum}
            <span className="whitespace-pre">{indent}</span>
            <span className="text-syntax-tag">&lt;/{block.xmlTag}&gt;</span>
          </div>
        )
        lineNumber++
      }
    }

    tree.forEach((block) => renderBlock(block, 0))

    return lines
  }, [tree, snippets, indentSize, showLineNumbers])

  if (tree.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        Your XML prompt will appear here once you add blocks...
      </div>
    )
  }

  return (
    <div className="font-mono text-sm">
      {renderedLines}
    </div>
  )
}
