import {z } from 'zod';

export const uploadFilesSchema = z.object({
    files: z.custom((value) => {
        const files = Array.isArray(value) ? value : [value];
        return files.length > 0;
    }, {
        message: "Debes subir al menos un archivo",
    }),
});
export type typeUploadFilesSchema = z.infer<typeof uploadFilesSchema>;