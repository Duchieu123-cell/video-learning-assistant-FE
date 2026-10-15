import { z } from "zod";

export const registerSchema = z.object({
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
    confirm_password: z
        .string()
        .min(1, "Xác nhận mật khẩu không được để trống")
        .min(4, "Xác nhận mật khẩu phải có ít nhất 4 ký tự")
        .max(255, "Xác nhận mật khẩu không được vượt quá 255 ký tự")
        .regex(/[a-zA-Z]/, "Xác nhận mật khẩu phải chứa ít nhất 1 chữ cái")
        .regex(/[A-Z]/, "Xác nhận mật khẩu phải chứa ít nhất 1 chữ hoa")
        .regex(/[0-9]/, "Xác nhận mật khẩu phải chứa ít nhất 1 chữ số")
        .regex(/[^a-zA-Z0-9]/, "Xác nhận mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    full_name: z
        .string()
        .min(1, "Họ và tên không được để trống")
        .max(100, "Họ và tên không được vượt quá 100 ký tự"),

}).refine(
    (data) => data.password === data.confirm_password,
    {
        message: "Mật khẩu và xác nhận mật khẩu không khớp",
        path: ["confirm_password"],
    }
);