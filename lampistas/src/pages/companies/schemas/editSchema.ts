import { z} from "zod";

export const editSchema  = z.object({
    workerid: z.string().min(1, 'Worker ID es requerido'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional().or(z.literal('')),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
}).refine((data) => {
    // Al menos uno de los campos debe tener valor para editar
    return (data.name && data.name.length > 0) || 
           (data.email && data.email.length > 0) || 
           (data.password && data.password.length > 0);
}, {
    message: "Debes proporcionar al menos un campo (nombre, email o contraseña) para editar.",
});

export type EditSchema = z.infer<typeof editSchema>;