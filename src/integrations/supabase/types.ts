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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          email: string
          business_name: string | null
          business_type: string | null
          status: Database["public"]["Enums"]["account_status_enum"]
          sandbox_api_key: string | null
          sandbox_api_key_hash: string | null
          live_api_key_hash: string | null
          api_key_last_four: string | null
          callback_url: string | null
          webhook_url: string | null
          webhook_secret: string | null
          min_payout_amount: number
          payout_phone: string | null
          payout_verified: boolean
          ip_whitelist: string[]
          totp_secret: string | null
          totp_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          business_name?: string | null
          business_type?: string | null
          status?: Database["public"]["Enums"]["account_status_enum"]
          sandbox_api_key?: string | null
          sandbox_api_key_hash?: string | null
          live_api_key_hash?: string | null
          api_key_last_four?: string | null
          callback_url?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          min_payout_amount?: number
          payout_phone?: string | null
          payout_verified?: boolean
          ip_whitelist?: string[]
          totp_secret?: string | null
          totp_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          business_name?: string | null
          business_type?: string | null
          status?: Database["public"]["Enums"]["account_status_enum"]
          sandbox_api_key?: string | null
          sandbox_api_key_hash?: string | null
          live_api_key_hash?: string | null
          api_key_last_four?: string | null
          callback_url?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          min_payout_amount?: number
          payout_phone?: string | null
          payout_verified?: boolean
          ip_whitelist?: string[]
          totp_secret?: string | null
          totp_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
          ip_address: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dispute_messages: {
        Row: {
          created_at: string | null
          dispute_id: string
          id: string
          is_admin: boolean | null
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          dispute_id: string
          id?: string
          is_admin?: boolean | null
          message: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          dispute_id?: string
          id?: string
          is_admin?: boolean | null
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          created_at: string | null
          id: string
          opened_by: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          opened_by: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          opened_by?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      escrow_wallets: {
        Row: {
          auto_release_date: string | null
          created_at: string | null
          currency: string | null
          gross_amount: number
          id: string
          locked_at: string | null
          net_amount: number
          order_id: string | null
          platform_fee: number
          released_at: string | null
          released_by: string | null
          requires_buyer_confirmation: boolean | null
          status: string | null
          updated_at: string | null
          wallet_ref: string
        }
        Insert: {
          auto_release_date?: string | null
          created_at?: string | null
          currency?: string | null
          gross_amount: number
          id?: string
          locked_at?: string | null
          net_amount: number
          order_id?: string | null
          platform_fee: number
          released_at?: string | null
          released_by?: string | null
          requires_buyer_confirmation?: boolean | null
          status?: string | null
          updated_at?: string | null
          wallet_ref: string
        }
        Update: {
          auto_release_date?: string | null
          created_at?: string | null
          currency?: string | null
          gross_amount?: number
          id?: string
          locked_at?: string | null
          net_amount?: number
          order_id?: string | null
          platform_fee?: number
          released_at?: string | null
          released_by?: string | null
          requires_buyer_confirmation?: boolean | null
          status?: string | null
          updated_at?: string | null
          wallet_ref?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          created_at: string | null
          credit_account: string
          credit_balance_after: number | null
          credit_balance_before: number | null
          debit_account: string
          debit_balance_after: number | null
          debit_balance_before: number | null
          description: string | null
          entry_ref: string
          id: string
          metadata: Json | null
          order_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_account: string
          credit_balance_after?: number | null
          credit_balance_before?: number | null
          debit_account: string
          debit_balance_after?: number | null
          debit_balance_before?: number | null
          description?: string | null
          entry_ref: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_account?: string
          credit_balance_after?: number | null
          credit_balance_before?: number | null
          debit_account?: string
          debit_balance_after?: number | null
          debit_balance_before?: number | null
          description?: string | null
          entry_ref?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
      mpesa_transactions: {
        Row: {
          amount: number | null
          callback_data: Json | null
          checkout_request_id: string | null
          completed_at: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          order_id: string | null
          phone_number: string | null
          raw_request: Json | null
          raw_response: Json | null
          result_code: string | null
          result_desc: string | null
          status: string | null
          transaction_type: string | null
        }
        Insert: {
          amount?: number | null
          callback_data?: Json | null
          checkout_request_id?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          order_id?: string | null
          phone_number?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          result_code?: string | null
          result_desc?: string | null
          status?: string | null
          transaction_type?: string | null
        }
        Update: {
          amount?: number | null
          callback_data?: Json | null
          checkout_request_id?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          order_id?: string | null
          phone_number?: string | null
          raw_request?: Json | null
          raw_response?: Json | null
          result_code?: string | null
          result_desc?: string | null
          status?: string | null
          transaction_type?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          expires_at: string | null
          id: string
          product_id: string | null
          seller_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          seller_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          seller_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_accounts: {
        Row: {
          account_type: string
          balance: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          account_type: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: string[] | null
          is_available: boolean | null
          name: string
          price: number | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock: number | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          name: string
          price?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock?: number | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          name?: string
          price?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock?: number | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          avatar_url: string | null
          business_address: string | null
          business_name: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          last_login: string | null
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          created_at: string | null
          id: string
          last_scanned_at: string | null
          page_id: string | null
          page_url: string
          platform: Database["public"]["Enums"]["social_platform"]
          scan_status: string | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_scanned_at?: string | null
          page_id?: string | null
          page_url: string
          platform: Database["public"]["Enums"]["social_platform"]
          scan_status?: string | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_scanned_at?: string | null
          page_id?: string | null
          page_url?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          scan_status?: string | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          logo: string | null
          name: string
          seller_id: string
          slug: string
          status: Database["public"]["Enums"]["store_status"] | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          seller_id: string
          slug: string
          status?: Database["public"]["Enums"]["store_status"] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          seller_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["store_status"] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          accepted_at: string | null
          amount: number
          auto_release_at: string | null
          buyer_address: string | null
          buyer_confirmed_at: string | null
          buyer_email: string | null
          buyer_id: string | null
          buyer_name: string | null
          buyer_phone: string | null
          cancelled_at: string | null
          completed_at: string | null
          courier_name: string | null
          created_at: string | null
          currency: string | null
          delivered_at: string | null
          delivery_proof_urls: string[] | null
          escrow_status: string | null
          escrow_wallet_id: string | null
          expires_at: string | null
          id: string
          item_description: string | null
          item_images: string[] | null
          item_name: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          platform_fee: number | null
          product_id: string | null
          quantity: number | null
          refunded_at: string | null
          seller_id: string
          seller_payout: number | null
          shipped_at: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          amount: number
          auto_release_at?: string | null
          buyer_address?: string | null
          buyer_confirmed_at?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          courier_name?: string | null
          created_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_proof_urls?: string[] | null
          escrow_status?: string | null
          escrow_wallet_id?: string | null
          expires_at?: string | null
          id: string
          item_description?: string | null
          item_images?: string[] | null
          item_name: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          platform_fee?: number | null
          product_id?: string | null
          quantity?: number | null
          refunded_at?: string | null
          seller_id: string
          seller_payout?: number | null
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          amount?: number
          auto_release_at?: string | null
          buyer_address?: string | null
          buyer_confirmed_at?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          courier_name?: string | null
          created_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_proof_urls?: string[] | null
          escrow_status?: string | null
          escrow_wallet_id?: string | null
          expires_at?: string | null
          id?: string
          item_description?: string | null
          item_images?: string[] | null
          item_name?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          platform_fee?: number | null
          product_id?: string | null
          quantity?: number | null
          refunded_at?: string | null
          seller_id?: string
          seller_payout?: number | null
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          reference: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          available_balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          pending_balance: number | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          id: string
          account_id: string
          director_name: string | null
          phone: string | null
          address: string | null
          kra_pin: string | null
          expected_volume: string | null
          id_document_url: string | null
          business_cert_url: string | null
          agreement_signed: boolean
          agreement_pdf_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          rejection_reason: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          director_name?: string | null
          phone?: string | null
          address?: string | null
          kra_pin?: string | null
          expected_volume?: string | null
          id_document_url?: string | null
          business_cert_url?: string | null
          agreement_signed?: boolean
          agreement_pdf_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          director_name?: string | null
          phone?: string | null
          address?: string | null
          kra_pin?: string | null
          expected_volume?: string | null
          id_document_url?: string | null
          business_cert_url?: string | null
          agreement_signed?: boolean
          agreement_pdf_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      holds: {
        Row: {
          id: string
          transaction_id: string | null
          account_id: string
          amount: number
          status: Database["public"]["Enums"]["hold_status"]
          condition_type: Database["public"]["Enums"]["condition_type"] | null
          condition_id: string | null
          expiry_at: string | null
          released_at: string | null
          released_by: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          transaction_id?: string | null
          account_id: string
          amount: number
          status?: Database["public"]["Enums"]["hold_status"]
          condition_type?: Database["public"]["Enums"]["condition_type"] | null
          condition_id?: string | null
          expiry_at?: string | null
          released_at?: string | null
          released_by?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          transaction_id?: string | null
          account_id?: string
          amount?: number
          status?: Database["public"]["Enums"]["hold_status"]
          condition_type?: Database["public"]["Enums"]["condition_type"] | null
          condition_id?: string | null
          expiry_at?: string | null
          released_at?: string | null
          released_by?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
          created_at?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "holds_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      conditions: {
        Row: {
          id: string
          account_id: string
          name: string
          type: Database["public"]["Enums"]["condition_type"]
          config: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          name: string
          type: Database["public"]["Enums"]["condition_type"]
          config?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          name?: string
          type?: Database["public"]["Enums"]["condition_type"]
          config?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conditions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      disbursements: {
        Row: {
          id: string
          hold_id: string | null
          account_id: string
          amount: number
          fee_deducted: number
          status: Database["public"]["Enums"]["disbursement_status"]
          recipient_phone: string | null
          recipient_name: string | null
          notes: string | null
          created_at: string
          completed_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          hold_id?: string | null
          account_id: string
          amount: number
          fee_deducted?: number
          status?: Database["public"]["Enums"]["disbursement_status"]
          recipient_phone?: string | null
          recipient_name?: string | null
          notes?: string | null
          created_at?: string
          completed_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          hold_id?: string | null
          account_id?: string
          amount?: number
          fee_deducted?: number
          status?: Database["public"]["Enums"]["disbursement_status"]
          recipient_phone?: string | null
          recipient_name?: string | null
          notes?: string | null
          created_at?: string
          completed_at?: string | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "disbursements_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disbursements_hold_id_fkey"
            columns: ["hold_id"]
            isOneToOne: false
            referencedRelation: "holds"
            referencedColumns: ["id"]
          }
        ]
      }
      support_tickets: {
        Row: {
          id: string
          account_id: string
          subject: string
          description: string
          category: string
          priority: string
          status: string
          assigned_to: string | null
          resolution: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          subject: string
          description: string
          category?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          subject?: string
          description?: string
          category?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      webhooks: {
        Row: {
          id: string
          account_id: string
          event_type: string
          payload: Json
          url: string
          response_code: number | null
          response_body: string | null
          attempts: number
          max_attempts: number
          last_attempt_at: string | null
          next_attempt_at: string | null
          delivered: boolean
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          event_type: string
          payload: Json
          url: string
          response_code?: number | null
          response_body?: string | null
          attempts?: number
          max_attempts?: number
          last_attempt_at?: string | null
          next_attempt_at?: string | null
          delivered?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          event_type?: string
          payload?: Json
          url?: string
          response_code?: number | null
          response_body?: string | null
          attempts?: number
          max_attempts?: number
          last_attempt_at?: string | null
          next_attempt_at?: string | null
          delivered?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "active" | "suspended" | "pending_verification"
      account_status_enum: "EMAIL_UNVERIFIED" | "EMAIL_VERIFIED" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
      app_role: "admin" | "seller" | "buyer"
      condition_type: "CLIENT_APPROVAL" | "DELIVERY_CONFIRM" | "TIMER" | "CUSTOM"
      disbursement_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      hold_status: "ACTIVE" | "RELEASED" | "CANCELLED" | "EXPIRED"
      kyc_status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"
      payment_method_enum: "MPESA" | "AIRTEL" | "CARD"
      product_status: "draft" | "published" | "archived"
      social_platform: "instagram" | "facebook" | "linkedin"
      store_status: "inactive" | "active" | "frozen"
      transaction_status:
        | "pending"
        | "processing"
        | "paid"
        | "accepted"
        | "shipped"
        | "delivered"
        | "completed"
        | "disputed"
        | "cancelled"
        | "refunded"
        | "expired"
      txn_status: "PENDING" | "SUCCESS" | "FAILED" | "HELD" | "RELEASED" | "REFUNDED"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended", "pending_verification"],
      account_status_enum: ["EMAIL_UNVERIFIED", "EMAIL_VERIFIED", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      app_role: ["admin", "seller", "buyer"],
      condition_type: ["CLIENT_APPROVAL", "DELIVERY_CONFIRM", "TIMER", "CUSTOM"],
      disbursement_status: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      hold_status: ["ACTIVE", "RELEASED", "CANCELLED", "EXPIRED"],
      kyc_status: ["DRAFT", "PENDING", "APPROVED", "REJECTED"],
      payment_method_enum: ["MPESA", "AIRTEL", "CARD"],
      product_status: ["draft", "published", "archived"],
      social_platform: ["instagram", "facebook", "linkedin"],
      store_status: ["inactive", "active", "frozen"],
      transaction_status: [
        "pending",
        "processing",
        "paid",
        "accepted",
        "shipped",
        "delivered",
        "completed",
        "disputed",
        "cancelled",
        "refunded",
        "expired",
      ],
      txn_status: ["PENDING", "SUCCESS", "FAILED", "HELD", "RELEASED", "REFUNDED"],
    },
  },
} as const
