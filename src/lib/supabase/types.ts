export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    github_url: string | null
                    readme_content: string | null
                    custom_content: Json | null
                    thumbnail_url: string | null
                    tags: string[] | null
                    order_index: number
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    github_url?: string | null
                    readme_content?: string | null
                    custom_content?: Json | null
                    thumbnail_url?: string | null
                    tags?: string[] | null
                    order_index?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    github_url?: string | null
                    readme_content?: string | null
                    custom_content?: Json | null
                    thumbnail_url?: string | null
                    tags?: string[] | null
                    order_index?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
            }
            media: {
                Row: {
                    id: string
                    project_id: string | null
                    url: string
                    type: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    url: string
                    type?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    url?: string
                    type?: string | null
                    created_at?: string
                }
            }
        }
    }
}
