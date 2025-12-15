import {z} from "zod";

export const CreateMachinerySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    brand: z.string().min(1, "La marca es obligatoria"),
    model: z.string().min(1, "El modelo es obligatorio"),
    serialNumber: z.string().min(1, "El número de serie es obligatorio"),
    machineType: z.string().min(1, "El tipo de maquinaria es obligatorio"),
    installedAt: z.string().min(1, "La fecha de instalación es obligatoria")
        .refine((date) => !isNaN(Date.parse(date)), { message: "La fecha de instalación no es válida" })
        .refine((date) => {
            const parsedDate = new Date(date);
            const now = new Date();
            return parsedDate <= now;
        }, { message: "La fecha de instalación no puede ser futura" }),
    companyName: z.string().min(1, "El nombre de la empresa es obligatorio"),
    clientID: z.string()
        .optional()
        .or(z.literal(''))
        .transform((val) => val && val !== '' ? parseInt(val) : undefined),
});

export type CreateMachineryType = z.infer<typeof CreateMachinerySchema>;