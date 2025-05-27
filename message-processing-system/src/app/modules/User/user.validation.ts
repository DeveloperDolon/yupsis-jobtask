import { z } from 'zod';

const userCreateValidation = z.object({
  body: z.object({
    password: z.string().min(5, 'Password must be at least 5 character!'),
    user: z.object({
      name: z.string().min(3, 'Name must be at least 3 character!'),
      email: z.string().email(),
    }),
  }),
});

const userLoginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().max(20),
  }),
});

const UserValidation = { userCreateValidation, userLoginValidation };

export default UserValidation;
