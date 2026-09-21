export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      hotmart_compras: {
        Row: {
          created_at: string
          email: string
          evento: string | null
          id: string
          nome: string | null
          payload: Json | null
          produto: string | null
          status: string
          transacao: string | null
        }
        Insert: {
          created_at?: string
          email: string
          evento?: string | null
          id?: string
          nome?: string | null
          payload?: Json | null
          produto?: string | null
          status?: string
          transacao?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          evento?: string | null
          id?: string
          nome?: string | null
          payload?: Json | null
          produto?: string | null
          status?: string
          transacao?: string | null
        }
        Relationships: []
      }
      itens: {
        Row: {
          camada: number
          comprado: boolean
          created_at: string
          id: string
          nome: string
          observacao: string | null
          preco: number
          projeto_id: string
          seguranca_ok: boolean
          user_id: string
        }
        Insert: {
          camada?: number
          comprado?: boolean
          created_at?: string
          id?: string
          nome: string
          observacao?: string | null
          preco?: number
          projeto_id: string
          seguranca_ok?: boolean
          user_id: string
        }
        Update: {
          camada?: number
          comprado?: boolean
          created_at?: string
          id?: string
          nome?: string
          observacao?: string | null
          preco?: number
          projeto_id?: string
          seguranca_ok?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          acesso_liberado: boolean
          created_at: string
          email: string
          id: string
          nome: string | null
          origem: string
        }
        Insert: {
          acesso_liberado?: boolean
          created_at?: string
          email: string
          id: string
          nome?: string | null
          origem?: string
        }
        Update: {
          acesso_liberado?: boolean
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          origem?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          created_at: string
          dados: Json
          id: string
          idade: string | null
          nome: string
          nome_crianca: string | null
          orcamento: number
          palavras: string[]
          paleta_id: string | null
          paleta_nome: string | null
          passos_concluidos: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dados?: Json
          id?: string
          idade?: string | null
          nome?: string
          nome_crianca?: string | null
          orcamento?: number
          palavras?: string[]
          paleta_id?: string | null
          paleta_nome?: string | null
          passos_concluidos?: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dados?: Json
          id?: string
          idade?: string | null
          nome?: string
          nome_crianca?: string | null
          orcamento?: number
          palavras?: string[]
          paleta_id?: string | null
          paleta_nome?: string | null
          passos_concluidos?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referencias: {
        Row: {
          arquivo_nome: string | null
          arquivo_path: string | null
          arquivo_tipo: string | null
          cheio_vazio: string | null
          cor_dominante: string | null
          created_at: string
          id: string
          material: string | null
          no_painel: boolean
          projeto_id: string
          titulo: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_path?: string | null
          arquivo_tipo?: string | null
          cheio_vazio?: string | null
          cor_dominante?: string | null
          created_at?: string
          id?: string
          material?: string | null
          no_painel?: boolean
          projeto_id: string
          titulo?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_path?: string | null
          arquivo_tipo?: string | null
          cheio_vazio?: string | null
          cor_dominante?: string | null
          created_at?: string
          id?: string
          material?: string | null
          no_painel?: boolean
          projeto_id?: string
          titulo?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referencias_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
