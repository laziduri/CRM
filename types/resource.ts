export interface Resource {
  id: string
  title: string
  description?: string
  href: string
  type?: 'article' | 'guide' | 'calculator' | 'tool'
  category?: string
  image?: string
  date?: string
  author?: string
}
