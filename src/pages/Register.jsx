import { Link } from "react-router-dom";
import { userApi } from "../api/userApi.js";
import InputField from '../components/InputField.jsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerSchema } from '../schemas/registerSchema.js'

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError
    } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data) => {
        try {
            const { user_id } = await userApi.register(data)
            console.log("User được đăng ký thành công: ", user_id)
            reset();
        } catch (error) {
            setError("formError", {
                type: "server",
                message: error.response?.data?.detail || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."
            })
        }
    }

    return (
        <div className="flex items-center justify-center bg-blue-500 p-8">
            <form
                className="rounded-xl shadow-md flex flex-col bg-white p-8 gap-4 w-1/2"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <h1 className="text-xl text-center font-bold">Đăng ký</h1>

                <InputField
                    label="Email"
                    type="email"
                    placeholder="Nhập email..."
                    {...register("email")}
                    error={errors.email?.message}
                    
                />

                <InputField
                    label="Mật khẩu"
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    {...register("password")}
                    error={errors.password?.message}
                />

                <InputField
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="Nhập lại mật khẩu..."
                    {...register("confirm_password")}
                    error={errors.confirm_password?.message}
                />

                <InputField
                    label="Tên đầy đủ"
                    type="text"
                    placeholder="Nhập tên đầy đủ..."
                    {...register("full_name")}
                    error={errors.full_name?.message}
                />

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

                {errors.formError && (
                    <p className="text-md font-semibold text-red-500 text-center">Error happend: {errors.formError.message}</p>
                )}

                <div className="self-center text-sm">
                    Đã có tài khoản? <span className="text-blue-400 hover:text-blue-600"><Link to="/">Đăng nhập ngay</Link></span>
                </div>
                
            </form>
        </div>
    )
}

export default Register