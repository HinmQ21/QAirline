import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/services/client/main";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabType = "login" | "signup";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(6, "Password phải từ 6 ký tự"),
});

const signupFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  username: z.string().min(3, "Tên đăng nhập phải từ 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  confirmPassword: z.string().min(6, "Nhập lại mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export const AuthButtons = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>("login");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleOpenDialog = (tab: TabType) => {
    setIsOpen(true);
    setCurrentTab(tab);
    loginForm.reset();
    signupForm.reset();
  };

  function onLogin(data: z.infer<typeof loginFormSchema>): void {
    setIsSubmitting(true);
    toast.promise(
      clientApi.login(data.username, data.password),
      {
        loading: 'Vui lòng chờ...',
        success: (_) => {
          setIsOpen(false);
          window.location.reload();
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

  function onSignup(data: z.infer<typeof signupFormSchema>): void {
    setIsSubmitting(true);
    toast.promise(
      clientApi.register({
        email: data.email,
        username: data.username,
        password: data.password,
        fullName: "",
        phoneNumber: "",
        address: "",
      }),
      {
        loading: 'Vui lòng chờ...',
        success: (_) => {
          setIsSubmitting(false);
          setCurrentTab("login");
          return 'Đăng ký thành công! Vui lòng đăng nhập.';
        },
      }
    )
  }

  return (
    <>
      <button
        onClick={() => handleOpenDialog("login")}
        className="header-link reddit-regular ml-5 text-white hover:text-indigo-300 transition-colors duration-200"
      >
        Log in
      </button>

      <p className="reddit-regular text-base select-none text-white/60">|</p>

      <button
        onClick={() => handleOpenDialog("signup")}
        className="cursor-pointer reddit-regular text-base bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 
          border border-indigo-500 rounded-xl py-2 px-4 text-white 
          hover:border-indigo-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Sign up
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl">
          <div className="relative">
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {currentTab === "login" ? "Đăng nhập" : "Đăng ký"}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabType)}>
              <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 text-gray-600 shadow-sm"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 text-gray-600 shadow-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Đăng ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tên đăng nhập</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập tên đăng nhập"
                              className="bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                className="bg-white border-gray-200 text-gray-900 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang đăng nhập...</span>
                        </div>
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tên đăng nhập</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập tên đăng nhập"
                              className="bg-white border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="bg-white border-gray-200 text-gray-900 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nhập lại mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="bg-white border-gray-200 text-gray-900 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-indigo-600" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang tạo tài khoản...</span>
                        </div>
                      ) : (
                        "Tạo tài khoản"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 