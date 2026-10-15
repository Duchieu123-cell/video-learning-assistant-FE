import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email("Email không hợp lệ"),
    password: z
        .string()
        .min(1, "Mật khẩu không được để trống")
        .min(4, "Mật khẩu phải có ít nhất 4 ký tự")
        .max(255, "Mật khẩu không được vượt quá 255 ký tự")
        .regex(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
        .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
})