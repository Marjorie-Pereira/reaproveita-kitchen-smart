export function capitalizeFirstLetter(val: string) {
  return (
    String(val).charAt(0).toUpperCase() +
    String(val).toLocaleLowerCase().slice(1)
  );
}

export function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")      
    .replace(/[^a-zA-Z0-9 ]/g, "")        
    .toLowerCase();
}
