import path from 'path';

export function getFilePath(file){
   if (!file || !file.path) return "";
   const normalizedPath = file.path.replace(/\\/g, '/');
   const uploadIndex = normalizedPath.toLowerCase().indexOf('/uploads/');

   if (uploadIndex !== -1) {
      // Devuelve ruta relativa a /uploads, por ejemplo "image/xyz" o "avatar/xyz"
      return normalizedPath.substring(uploadIndex + '/uploads/'.length);
   }

   // Si no hay '/uploads/' en la ruta, usamos basename como fallback.
   return path.basename(normalizedPath);
}