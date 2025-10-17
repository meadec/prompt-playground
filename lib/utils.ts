import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function flattenTree<T extends { id: string; children?: T[] }>(
  nodes: T[]
): T[] {
  const result: T[] = []
  const flatten = (items: T[]) => {
    items.forEach((item) => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }
  flatten(nodes)
  return result
}

export function isDescendant(
  blockId: string,
  potentialAncestorId: string,
  allBlocks: Array<{ id: string; parentId: string | null }>
): boolean {
  let currentId: string | null = blockId
  while (currentId) {
    if (currentId === potentialAncestorId) return true
    const block = allBlocks.find((b) => b.id === currentId)
    currentId = block?.parentId || null
  }
  return false
}
