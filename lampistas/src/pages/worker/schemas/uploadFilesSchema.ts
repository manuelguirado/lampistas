import {z } from 'zod';

export const uploadFilesSchema = z.object({
    files: z.custom((value) => {
        if (typeof window === "undefined" || !value || !(value instanceof window.FileList)) {
            return false;
        }
        return value.length > 0;
    }, {
        message: "Debes subir al menos un archivo",
    }),
});
export type typeUploadFilesSchema = z.infer<typeof uploadFilesSchema>;