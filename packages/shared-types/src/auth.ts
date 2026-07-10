export interface AdminDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseDto extends AuthTokensDto {
  admin: AdminDto;
}
