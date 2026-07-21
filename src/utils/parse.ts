export function parseJsonField<T>(field: unknown, defaultValue: T): T {
  if (!field) return defaultValue;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return (Array.isArray(parsed) || typeof parsed === 'object' ? parsed : defaultValue) as T;
    } catch {
      return defaultValue;
    }
  }
  return field as T;
}
