export interface HeroContentDto {
  id: number;
  eyebrow: string | null;
  title: string;
  highlightedText: string | null;
  description: string | null;
  primaryButtonText: string | null;
  primaryButtonLink: string | null;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CeoMessageDto {
  id: number;
  name: string;
  title: string;
  description: string;
  imagePath: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettingsDto {
  id: number;
  companyName: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  logoPath: string | null;
  createdAt: string;
  updatedAt: string;
}
