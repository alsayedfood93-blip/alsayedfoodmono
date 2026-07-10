export interface JwtAccessPayload {
  sub: number;
  username: string;
}

export interface AuthenticatedAdmin {
  id: number;
  username: string;
}
