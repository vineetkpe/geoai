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
      scans: {
        Row: {
          id: string
          domain: string
          brand_description: string
          custom_queries: Json
          visibility_score: number
          is_unlocked: boolean
          unlocked_by_email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          domain: string
          brand_description: string
          custom_queries?: Json
          visibility_score?: number
          is_unlocked?: boolean
          unlocked_by_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          domain?: string
          brand_description?: string
          custom_queries?: Json
          visibility_score?: number
          is_unlocked?: boolean
          unlocked_by_email?: string | null
          created_at?: string
        }
      }
      scan_queries: {
        Row: {
          id: string
          scan_id: string
          query_text: string
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          query_text: string
          created_at: string
        }
        Update: {
          id?: string
          scan_id?: string
          query_text?: string
          created_at?: string
        }
      }
      scan_results: {
        Row: {
          id: string
          scan_query_id: string
          model_name: string
          raw_response: string
          mentioned: boolean
          competitors_mentioned: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          scan_query_id: string
          model_name: string
          raw_response: string
          mentioned?: boolean
          competitors_mentioned?: Json
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          scan_query_id?: string
          model_name?: string
          raw_response?: string
          mentioned?: boolean
          competitors_mentioned?: Json
          status?: string
          created_at?: string
        }
      }
      domain_scan_limits: {
        Row: {
          id: string
          domain: string
          last_scan_id: string | null
          last_scanned_at: string
        }
        Insert: {
          id?: string
          domain: string
          last_scan_id?: string | null
          last_scanned_at?: string
        }
        Update: {
          id?: string
          domain?: string
          last_scan_id?: string | null
          last_scanned_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
