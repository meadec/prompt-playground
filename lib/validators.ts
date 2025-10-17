import { z } from "zod"

export const snippetSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().uuid().nullable(),
  tagIds: z.array(z.string().uuid()),
  isFavorite: z.boolean(),
  usageCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  createdAt: z.string().datetime(),
})

export const promptBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text', 'snippet', 'container']),
  content: z.string(),
  snippetId: z.string().uuid().nullable(),
  xmlTag: z.string().nullable(),
  xmlAttributes: z.record(z.string(), z.string()),
  parentId: z.string().uuid().nullable(),
  order: z.number().int().min(0),
  depth: z.number().int().min(0).max(10),
  isCollapsed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const appSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  defaultXmlTags: z.array(z.string()),
  autoSave: z.boolean(),
  showLineNumbers: z.boolean(),
  indentSize: z.number().int().min(2).max(4),
  version: z.string(),
})

export const storageMetadataSchema = z.object({
  version: z.string(),
  lastBackup: z.string().datetime().nullable(),
  installDate: z.string().datetime(),
  lastModified: z.string().datetime(),
})

// Input schemas for creating new entities (without auto-generated fields)
export const createSnippetSchema = snippetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const createTagSchema = tagSchema.omit({
  id: true,
  createdAt: true,
})

export const createPromptBlockSchema = promptBlockSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type CreatePromptBlockInput = z.infer<typeof createPromptBlockSchema>
