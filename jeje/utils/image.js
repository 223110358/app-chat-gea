import path from 'path';

export function getFilePath(file){
    const normalized = file.path.replace(/\\/g, "/");
    const uploadsIndex = normalized.indexOf("/uploads/");

    if (uploadsIndex !== -1) {
        // Retorna la ruta relativa a /uploads (sin /uploads al inicio)
        return normalized.slice(uploadsIndex + 9); // 9 = "/uploads/".length
    }

    // Fallback: extrae el nombre del archivo
    return path.basename(normalized);
}