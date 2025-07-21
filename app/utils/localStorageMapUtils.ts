// utils/localStorageMapUtils.ts

/**
 * Guarda un Map genérico en localStorage.
 * 
 * @param key Clave bajo la cual se guardará en localStorage.
 * @param map Mapa a serializar. Las claves deben ser strings.
 */
export function saveMapToLocalStorage<K extends string, V>(
  key: string,
  map: Map<K, V>
): void {
  if (map.size === 0) {
    localStorage.removeItem(key)
    return
  }

  const arrayData: [K, V][] = Array.from(map.entries())

  try {
    localStorage.setItem(key, JSON.stringify(arrayData))
  } catch (e) {
    console.error(`Failed to save data to localStorage for key "${key}":`, e)
  }
}

/**
 * Carga un Map genérico desde localStorage.
 * 
 * @param key Clave bajo la cual está guardado el mapa.
 * @param validate Opcional: función para validar la estructura de los datos.
 * @returns Map restaurado o vacío si falla.
 */
export function loadMapFromLocalStorage<K extends string, V>(
  key: string,
  validate?: (data: unknown) => data is [K, V][]
): Map<K, V> {
  const raw = localStorage.getItem(key)
  if (!raw) return new Map()

  try {
    const parsed = JSON.parse(raw)
    if (validate && !validate(parsed)) throw new Error('Invalid format')
    return new Map(parsed)
  } catch (e) {
    console.error(`Failed to load map from localStorage for key "${key}":`, e)
    return new Map()
  }
}

/**
 * Elimina una entrada del localStorage.
 * 
 * @param key Clave a limpiar.
 */
export function clearLocalStorageKey(key: string): void {
  localStorage.removeItem(key)
}
