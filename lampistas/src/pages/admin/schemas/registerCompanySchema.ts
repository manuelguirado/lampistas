import { z} from "zod";

export const registerCompanySchema = z.object({
  name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  companyLogo : z.array(z.instanceof(File)).max(1, "Solo se permite un archivo para el logo de la empresa"),
  
  directions : z.object({
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
    state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
    zipCode: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
  }),
});
export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>;