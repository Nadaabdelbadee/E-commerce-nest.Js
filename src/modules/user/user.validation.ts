import { BadRequestException } from "@nestjs/common";
import {z} from "zod"
export const userValidation = z
  .object({

    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),

  }).superRefine((value)=>{
    if (value.password !== value.confirmPassword) {
      throw new BadRequestException()  
    }
  });



  export type userValidationDto = z.infer<typeof userValidation>;
