import  {z} from "zod";

export const shiftSchema = z.object({
    startDate: z.string().min(1, "La fecha de inicio es requerida")
        .refine((val) => {
       
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "Fecha inválida" })
        .refine((val) => {
          
            const date = new Date(val);
            const now = new Date();
            return date >= now;
        }, { message: "La fecha debe ser actual o futura" }),
    endDate: z.string().min(1, "La fecha de fin es requerida")
        .refine((val) => {
            const date = new Date(val);
           
            return !isNaN(date.getTime());
        }, { message: "Fecha inválida" }),
    shiftType: z.enum(['morning', 'afternoon', 'night', 'fullday'], { message: "Tipo de turno inválido" }),
    notes: z.string().optional().or(z.literal('')),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
});

export type ShiftSchema = z.infer<typeof shiftSchema>;