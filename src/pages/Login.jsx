
import { useAuthStore } from '../store/useAuthStore.js'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import InputField from '../components/InputField.jsx'
import { loginSchema } from '../schemas/loginSchema.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { authApi } from '../api/authApi.js';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const { login } = useAuthStore.getState().actions;
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = location.state?.from?.pathname || '/courses';


    const onSubmit = async (formData) => {
        try {
            const { 
                access_token,
                full_name,
                role 
            } = await authApi.login(formData);

            login(access_token, full_name, role);
            navigate(previousPath, { replace: true });

        } catch (error) {
            setError("formError", {
                type: "server",
                message: error.response?.data?.detail?.message || "Đăng nhập thất bại. Vui lòng thử lại.",
            })
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-500">
            <form
                className="rounded-xl shadow-md flex flex-col bg-white p-8 gap-4 w-1/2"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <h1 className="text-xl text-center font-bold">Đăng nhập</h1>

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

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                {errors.formError && (
                    <p className="text-md font-semibold text-red-400 text-center">{errors.formError.message}</p>
                )}

                <div className="self-center text-sm">
                    Chưa có tài khoản? <span className="text-blue-400 hover:text-blue-600"><Link to="/register">Đăng ký ngay</Link></span>
                </div>
                
            </form>
        </div>
    )
}

export default Login