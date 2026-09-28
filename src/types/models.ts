// App-level aliases over the generated Supabase types in ./database.ts.
// Kept separate so `supabase gen types` can overwrite database.ts freely.
import type { Database } from "./database"

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

export type Organisation = Tables<"organisations">
export type Project = Tables<"projects">
export type DesignToken = Tables<"design_tokens">
export type FeatureRequest = Tables<"feature_backlog">
export type FeaturePriority = Enums<"feature_priority">
export type FeatureStatus = Enums<"feature_status">
export type ProjectStatus = Enums<"project_status">
