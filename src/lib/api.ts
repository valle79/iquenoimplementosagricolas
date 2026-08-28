/**
 * Capa de servicios de la web pública (iquenosac).
 * Reemplaza por completo las llamadas a Supabase: ahora consume la API FastAPI
 * del backend (mismo servidor que alimenta el panel admin).
 *
 * La URL base se configura con VITE_API_URL; si no está definida se usa el
 * backend de producción (Render). En desarrollo local, define VITE_API_URL
 * apuntando a tu backend local (p. ej. http://localhost:8000).
 */
import type { MachineProduct, SparePart, PromoData } from '../types';

// Anónimo/público: no exponemos secretos aquí.
const API_BASE: string = (import.meta.env.VITE_API_URL as string | undefined)
  ?.replace(/\/+$/, '') || 'https://panel-iqueno-proformas.onrender.com';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Error del servidor (HTTP ${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Tipos que devuelve la API pública (snake_case = columnas de la BD)
// ---------------------------------------------------------------------------
interface PublicAdvisor {
  id: number;
  name: string;
  position: string;
  image_url: string;
  whatsapp: string;
  specialties: string[];
}

export interface PublicProduct extends MachineProduct {
  price: string | number;
}

interface PublicSparePart extends SparePart {
  price: string | number;
  deleted: boolean;
  created_at: string;
}

interface PublicPromo {
  id: string;
  title: string;
  subtitle: string | null;
  features: string;
  image_url: string;
  valid_until: string;
  media_type: string;
  display_order: number | null;
}

// ---------------------------------------------------------------------------
// Funciones públicas
// ---------------------------------------------------------------------------
export async function fetchAdvisors(): Promise<PublicAdvisor[]> {
  return getJson<PublicAdvisor[]>('/public/advisors');
}

export async function fetchProducts(): Promise<MachineProduct[]> {
  const data = await getJson<PublicProduct[]>('/public/products');
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    image_url: p.image_url || '',
    pdf_url: p.pdf_url,
    specifications: p.specifications || [],
    features: p.features || [],
    dimensions: p.dimensions || { width: 0, height: 0, depth: 0, weight: 0 },
  }));
}

export async function fetchSpareParts(): Promise<SparePart[]> {
  const data = await getJson<PublicSparePart[]>('/public/spare-parts');
  return data.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description || '',
    image_url: s.image_url || '',
    price: String(s.price ?? ''),
    specifications: s.specifications || [],
    features: s.features || [],
  }));
}

export async function fetchPromotions(): Promise<PromoData[]> {
  const data = await getJson<PublicPromo[]>('/public/promotions');
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle || '',
    features: p.features || '',
    image: p.image_url,
    validUntil: p.valid_until,
    mediaType: p.media_type === 'video' ? 'video' : 'image',
  }));
}
