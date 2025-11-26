export function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function intersectInsensitive(arr1: string[], arr2: string[]) {
  // cria um Set com as versões normalizadas do segundo array
  const normalizedSet = new Set(arr2.map(normalize));

  // retorna valores originais de arr1 que possuem correspondência
  return arr1.filter((item) => normalizedSet.has(normalize(item)));
}
