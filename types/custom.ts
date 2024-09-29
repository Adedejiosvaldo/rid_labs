export interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  id: string;
}

export interface CustomSession {
  user?: CustomUser;
}
