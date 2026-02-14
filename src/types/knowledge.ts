export interface KnowledgeDocumentCreate {
  title: string
  content: string
  summary?: string
  doc_type?: string
  category?: string
  tags?: string[]
  related_positions?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface KnowledgeDocumentUpdate {
  title?: string
  content?: string
  summary?: string
  doc_type?: string
  category?: string
  tags?: string[]
  related_positions?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'active' | 'inactive'
}

export interface KnowledgeDocumentListParams {
  page?: number
  page_size?: number
  category?: string
  doc_type?: string
  status?: string
}

export interface KnowledgeDocument {
  id: string
  title: string
  summary: string | null
  doc_type: string | null
  category: string | null
  tags: string[] | null
  related_positions: string[] | null
  difficulty: string | null
  vectorized: boolean
  chunk_count: number
  view_count: number
  reference_count: number
  status: string
  created_by: string | null
  created_at: string
}

export interface KnowledgeDocumentDetail extends KnowledgeDocument {
  content: string
}
