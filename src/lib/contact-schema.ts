import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  subject: z.string().trim().min(2, "Please add a subject.").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a few words.")
    .max(5000),
  // Honeypot field — real users never see it. Filled = bot, handled silently
  // in the action (not validated here, so bots get no error signal).
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<keyof ContactInput, string>>;
};
