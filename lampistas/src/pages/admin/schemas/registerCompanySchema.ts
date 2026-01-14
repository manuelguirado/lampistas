import { z} from "zod";

export const registerCompanySchema = z.object({
  name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  companyLogo: z
    .custom<FileList>()
    .refine((files) => !files || files.length <= 1, "Solo se permite un archivo para el logo")
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
      "El archivo debe ser menor a 5MB"
    )
    .optional(),
  
  directions : z.object({
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
    state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
    zipCode: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
  }),
});
export type RegisterCompanySchema = z.infer<typeof registerCompanySchema>;