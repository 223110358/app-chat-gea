import path from 'path';

export function getFilePath(file){
   return file.path.replace(/\\/g, '/').replace(/^[^/]+\//, '');
}