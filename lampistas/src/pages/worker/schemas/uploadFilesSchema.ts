import {z } from 'zod';

export const uploadFilesSchema = z.object({
    files : z.array(z.instanceof(File)).refine(files => files.every(file => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/zip', 'application/x-rar-compressed', 'application/gzip'].includes(file.type)), { message: 'los archivos deben ser de un tipo válido' }),
});
export type typeUploadFilesSchema = z.infer<typeof uploadFilesSchema>;