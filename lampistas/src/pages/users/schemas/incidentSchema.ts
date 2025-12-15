import { boolean, z} from 'zod';

export const incidentSchema = z.object({
    title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100, 'El título no puede exceder los 100 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'La descripción no puede exceder los 500 caracteres'),
    location : z.string().min(5, 'La ubicación debe tener al menos 5 caracteres').max(200, 'La ubicación no puede exceder los 200 caracteres'),
    priority : z.enum(['LOW', 'MEDIUM', 'HIGH'], { error: 'La prioridad es obligatoria' }),
   urgency : boolean(),
});
export type typeIncidentSchema = z.infer<typeof incidentSchema>;