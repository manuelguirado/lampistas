import {z} from "zod";

// Schema para el INPUT del formulario (antes del transform)
export const suspendCompanySchema = z.object({
    companyId: z.string().min(1, "El ID de la empresa es requerido"),
    until: z.string()
        .min(1, "La fecha es requerida")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "Fecha inválida" })
        .refine((val) => {
            const date = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, { message: "La fecha debe ser hoy o en el futuro" }),
});

// Tipo para React Hook Form (sin transform)
export type SuspendCompanySchema = z.infer<typeof suspendCompanySchema>;

// Tipo para el OUTPUT (después de procesar)
export type SuspendCompanyOutput = {
    companyId: string;
    until: Date;
};
