import { z } from 'zod';

export const workerLoginSchema = z.object({
    email: z.string().optional(),
    password: z.string().optional(),
    code: z.string().optional(),
}).refine(
    (data) => {
        // Si hay código, no requiere email ni password
        if (data.code && data.code.length > 0) {
            return true;
        }
        // Si no hay código, debe tener email y password válidos
        if (data.email && data.password) {
            // Validar que el email sea válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return false;
            }
            // Validar que la password tenga al menos 6 caracteres
            if (data.password.length < 6) {
                return false;
            }
            return true;
        }
        return false;
    },
    {
        message: "Ingrese código de empresa O email y contraseña válidos",
    }
);

export type WorkerLoginSchema = z.infer<typeof workerLoginSchema>;