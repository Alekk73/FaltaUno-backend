export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD') // separa las letras de los acentos
    .replace(/[\u0300-\u036f]/g, '') // se eliminan los acentos
    .replace(/\s+/g, '-') // se reemplaza espacios por guiones
    .replace(/[^a-z0-9-]/g, '');
}
