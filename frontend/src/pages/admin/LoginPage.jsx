import { z } from "zod"
import { css } from "@/css/styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/services/admin/main";
import { Shield, User, Lock, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(6, "Password phải từ 6 ký tự"),
});

const checkLogin = async (navigate) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token != null) {
    try {
      toast.promise(
        adminApi.me(),
        {
          loading: 'Đang chuyển hướng...',
          success: (_) => {
            navigate("/admin/dashboard");
          },
          error: (err) => {
            const res = err.response;
            let errMsg;
            if (res !== undefined) {
              errMsg = res.data.message;
            } else {
              errMsg = err.toString();
            }
            return `Lỗi: ${errMsg}`;
          }
        }
      )
    } catch (err) {
      console.log(err.toString());
    }
  }
};

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => { checkLogin(navigate); }, [navigate]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    setIsSubmitting(true);
    toast.promise(
      adminApi.login(values.username, values.password),
      {
        loading: 'Vui lòng chờ...',
        success: (_) => {
          checkLogin(navigate);
          return 'Đăng nhập thành công!';
        },
        error: (err) => {
          let errMsg;
          try { errMsg = err.response.data.message; }
          catch (_) { errMsg = err.toString(); }
          setIsSubmitting(false);
          return `Lỗi: ${errMsg}`;
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-pink-950 opacity-95"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Admin Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <Shield className="w-10 h-10 text-pink-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">QAIRLINE</h1>
            <p className="text-gray-200 text-lg">Admin Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Đăng nhập quản trị</h2>
              <p className="text-gray-300">Vui lòng nhập thông tin để tiếp tục</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Tên đăng nhập</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            placeholder="Nhập tên đăng nhập" 
                            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-pink-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu" 
                            className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-pink-300" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Đăng nhập</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Additional info */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Chỉ dành cho quản trị viên được ủy quyền
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              © 2024 QAirline. Bảo mật và riêng tư.
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
