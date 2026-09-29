/**
 * Capa de servicios de la web pública (iquenosac).
 *
 * Única fuente de datos: el panel administrativo (panelAdminIqueno), que guarda
 * productos, repuestos, asesores y promociones en Supabase. Aquí solo se LEEN
 * (consultas anónimas de PostgREST), así que el panel sigue siendo el único que
 * crea, edita o elimina registros.
 *
 * Las credenciales son las mismas que el panel usa en el navegador (anon key),
 * por lo que no son un secreto. Se pueden sobrescribir con VITE_SUPABASE_URL y
 * VITE_SUPABASE_ANON_KEY.
 */
import type { MachineProduct, SparePart, PromoData } from '../types';

const SUPABASE_URL = (
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://rqouqtdgxsksueyskdow.supabase.co'
).replace(/\/+$/, '');

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb3VxdGRneHNrc3VleXNrZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjgxNTcsImV4cCI6MjA2OTIwNDE1N30.7s3i-7gJw-MiI0473eR_3gVX5TrskpJ1ivZKglfeMk0';

/**
 * GET de solo lectura sobre PostgREST. Replica exactamente los filtros que usa
 * el panel al listar (deleted = false y el mismo orden), de modo que la web
 * muestra siempre lo mismo que el administrador ve en el panel.
 */
async function getRows<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`No se pudo leer "${table}" del panel (HTTP ${res.status})`);
  }

  return (await res.json()) as T[];
}

/** Las columnas JSON del panel llegan como texto; las normalizamos a array. */
function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string' && value.trim() !== '') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Igual que toArray pero para el objeto de dimensiones del producto. */
function toDimensions(value: unknown): MachineProduct['dimensions'] {
  const empty = { width: 0, height: 0, depth: 0, weight: 0 };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const dim = value as Partial<MachineProduct['dimensions']>;
    return {
      width: Number(dim.width) || 0,
      height: Number(dim.height) || 0,
      depth: Number(dim.depth) || 0,
      weight: Number(dim.weight) || 0,
    };
  }
  if (typeof value === 'string' && value.trim() !== '') {
    try {
      return toDimensions(JSON.parse(value));
    } catch {
      return empty;
    }
  }
  return empty;
}

// ---------------------------------------------------------------------------
// Filas tal como las devuelve PostgREST (snake_case = columnas de la BD)
// ---------------------------------------------------------------------------
interface PublicAdvisor {
  id: number;
  name: string;
  position: string;
  image_url: string;
  whatsapp: string;
  specialties: string;
}

interface PublicProductRow {
  id: number;
  name: string;
  description: string;
  image_url: string;
  pdf_url: string | null;
  specifications: string;
  features: string;
  dimensions: string;
  price: string | number;
}

interface PublicSparePartRow {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: string | number;
  specifications: string;
  features: string;
}

interface PublicPromo {
  id: string;
  title: string;
  subtitle: string | null;
  features: string;
  image_url: string;
  valid_until: string;
  media_type: string;
}

export interface PublicProduct extends MachineProduct {
  price: string | number;
}

// ---------------------------------------------------------------------------
// Funciones públicas
// ---------------------------------------------------------------------------
export async function fetchAdvisors(): Promise<PublicAdvisor[]> {
  return getRows<PublicAdvisor>('advisors', {
    select: 'id,name,position,whatsapp,specialties,image_url',
    deleted: 'eq.false',
    order: 'id.asc',
  });
}

export async function fetchProducts(): Promise<MachineProduct[]> {
  const rows = await getRows<PublicProductRow>('machine_products', {
    select: 'id,name,description,image_url,pdf_url,specifications,features,dimensions',
    deleted: 'eq.false',
    order: 'id.desc',
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    image_url: p.image_url || '',
    pdf_url: p.pdf_url || undefined,
    specifications: toArray<{ label: string; value: string }>(p.specifications),
    features: toArray<string>(p.features),
    dimensions: toDimensions(p.dimensions),
  }));
}

export async function fetchSpareParts(): Promise<SparePart[]> {
  const rows = await getRows<PublicSparePartRow>('spare_parts', {
    select: 'id,name,description,image_url,price,specifications,features',
    deleted: 'eq.false',
    order: 'id.desc',
  });

  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description || '',
    image_url: s.image_url || '',
    price: String(s.price ?? ''),
    specifications: toArray<{ label: string; value: string }>(s.specifications),
    features: toArray<string>(s.features),
  }));
}

export async function fetchPromotions(): Promise<PromoData[]> {
  const rows = await getRows<PublicPromo>('promotions', {
    select: 'id,title,subtitle,features,image_url,valid_until,media_type',
    is_active: 'eq.true',
    show_in_web: 'eq.true',
    order: 'display_order.asc',
  });

  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle || '',
    features: p.features || '',
    image: p.image_url,
    validUntil: p.valid_until,
    mediaType: p.media_type === 'video' ? 'video' : 'image',
  }));
}
