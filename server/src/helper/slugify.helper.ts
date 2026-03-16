export default function slugify(text: string) {
  return text
    .toString()                         // Cast to string (optional)
    .normalize('NFD')                   // Split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '')  // Remove all previously split accents
    .toLowerCase()                      // Convert the string to lowercase letters
    .trim()                             // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-')              // Replace spaces with -
    .replace(/[^a-z0-9-]+/g, '')      // Remove all non-word chars except hyphens
    .replace(/-+/g, '-')               // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '')                // Remove leading hyphens
    .replace(/-+$/, '');               // Remove trailing hyphens

}