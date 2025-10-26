import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["Superadmin", "Client", "Notary", "PublicRegistrar"]),
  status: z.enum(["Active", "Paused", "Suspended", "Canceled"]),
  plan: z.enum(["Basic", "Pro", "Enterprise", "Government"]),
});

export type Client = z.infer<typeof clientSchema>;
