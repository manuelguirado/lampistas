import {z } from 'zod';

export const uploadFilesSchema = z.object({
    files: z.instanceof(FileList).refine(
        (files) => {
            if (files.length === 0) return false;
            return Array.from(files).every(file => 
                ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 
                 'application/pdf', 'application/msword', 
                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                 'application/vnd.ms-excel', 
                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                 'text/plain', 'application/zip', 'application/x-rar-compressed', 
                 'application/gzip'].includes(file.type)
            );
        }, 
        { message: 'Debes seleccionar al menos un archivo válido' }
    ),
});
export type typeUploadFilesSchema = z.infer<typeof uploadFilesSchema>;