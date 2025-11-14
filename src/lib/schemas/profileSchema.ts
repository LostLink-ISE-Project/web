import { z } from "zod";

// Schema for profile update
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  profilePhoto: z.string().optional(), // base64 string
});

// Schema for password update
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
      })
      .refine((val) => /[\W_]/.test(val), {
        message: "Password must include at least one special character",
      }),

    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });
