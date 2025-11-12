import z from 'zod';

export const EnvShema = z.object({
  DATABASE_URL: z.url().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  PORT: z.string().en,
});
