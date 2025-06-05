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
    <div
      className="min-h-screen min-w-screen bg-cover"
      style={{ backgroundImage: "url('/miscs/admin-bg.jpg')" }}
    >
      <div className="flex justify-center items-center h-screen">
        <div className={`${css.minipage.xl}`}>
          <div className="flex flex-col items-center mx-10 my-8">
            <p className="special-gothic-expanded-one-regular text-2xl mb-4">QAIRLINE</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black inter-medium text-base">Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input placeholder="thanhduc2k4" {...field} />
                      </FormControl>
                      <FormMessage className="reddit-regular" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black inter-medium text-base">Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage className="reddit-regular" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit" disabled={isSubmitting}>Đăng nhập</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
