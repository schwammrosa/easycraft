import { z } from 'zod';

const VALID_VARIANTS = ['variant1', 'variant2', 'variant3', 'variant4', 'variant5', 'variant6'];

export const createCharacterSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(20, 'Nome deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome deve conter apenas letras, números e underscore'),
  headVariant: z
    .string()
    .refine((val) => VALID_VARIANTS.includes(val), 'Variante de cabeça inválida'),
  armsVariant: z
    .string()
    .refine((val) => VALID_VARIANTS.includes(val), 'Variante de braços inválida'),
  legsVariant: z
    .string()
    .refine((val) => VALID_VARIANTS.includes(val), 'Variante de pernas inválida'),
  feetVariant: z
    .string()
    .refine((val) => VALID_VARIANTS.includes(val), 'Variante de pés inválida'),
});
