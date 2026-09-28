// Mirrors supabase/migrations/*. Regenerate after schema changes with:
//   npx supabase gen types typescript --linked > src/types/database.ts
// (or `--local` against `supabase start`).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          created_at: string
          primary_color: string
          logo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          primary_color?: string
          logo_url?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["organisations"]["Insert"]>
        Relationships: []
      }
      organisation_members: {
        Row: {
          org_id: string
          user_id: string
          role: Database["public"]["Enums"]["member_role"]
          created_at: string
        }
        Insert: {
          org_id: string
          user_id: string
          role?: Database["public"]["Enums"]["member_role"]
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["organisation_members"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "organisation_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          figma_embed_url: string | null
          repository_url: string | null
          staging_url: string | null
          status: Database["public"]["Enums"]["project_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          figma_embed_url?: string | null
          repository_url?: string | null
          staging_url?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      design_tokens: {
        Row: {
          id: string
          project_id: string
          token_category: Database["public"]["Enums"]["token_category"]
          key: string
          value: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          token_category: Database["public"]["Enums"]["token_category"]
          key: string
          value: string
          description?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["design_tokens"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "design_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_backlog: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          priority: Database["public"]["Enums"]["feature_priority"]
          status: Database["public"]["Enums"]["feature_status"]
          requested_by: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          priority?: Database["public"]["Enums"]["feature_priority"]
          status?: Database["public"]["Enums"]["feature_status"]
          requested_by: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["feature_backlog"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "feature_backlog_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_org_member: { Args: { p_org_id: string }; Returns: boolean }
      is_org_owner: { Args: { p_org_id: string }; Returns: boolean }
      project_org_id: { Args: { p_project_id: string }; Returns: string }
      create_organisation: {
        Args: { p_name: string; p_primary_color?: string; p_logo_url?: string | null }
        Returns: Database["public"]["Tables"]["organisations"]["Row"]
      }
    }
    Enums: {
      member_role: "owner" | "client"
      project_status: "planning" | "in_progress" | "review" | "live" | "paused"
      token_category: "colors" | "typography" | "icons"
      feature_priority: "low" | "medium" | "high"
      feature_status: "backlog" | "in_progress" | "completed"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
