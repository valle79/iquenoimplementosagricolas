export interface MachineProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  pdf_url?: string;
  specifications: { label: string; value: string }[];
  features: string[];
  dimensions: { width: number; height: number; depth: number; weight: number };
}

export interface SparePart {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: string;
  specifications: { label: string; value: string }[];
  features: string[];
}

export interface PromoData {
  id: string;
  title: string;
  subtitle: string;
  features: string;
  image: string;
  validUntil: string;
  mediaType: 'image' | 'video';
}
