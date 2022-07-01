import type { User } from "./User";

export interface LoginResponseDTO { user: User, token: string, }