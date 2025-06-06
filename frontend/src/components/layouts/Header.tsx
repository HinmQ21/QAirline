import { z } from "zod";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "@/services/schemes/auth";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/services/client/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServices } from "@/context/ServiceContext";
import { WeatherDisplay } from "@/components/layouts/Weather";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { User as UserIcon, Lock, Eye, EyeOff, Mail, Plane, Shield } from "lucide-react";

type TabType = "login" | "signup";

interface HeaderProps {
  isAtTop?: boolean;
  className?: string;
}

export const Header = ({ isAtTop = false, className = "" }: HeaderProps) => {
  const { userContext } = useServices();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('fetching user...')
    userContext.getchUser().then(
      (fetchedUser) => {
        console.log('fetch user success!');
        console.log(fetchedUser);
        setUser(fetchedUser);
        setIsLoading(false);
      }
    ).catch(
      (error) => {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div className={`header ${isAtTop ? "header-top" : "header-scrolled"} ${className}`}>
      <div className="flex items-center ml-10">
        <Link to="/" className="special-gothic-expanded-one-regular text-2xl">
          QAIRLINE
        </Link>
        <div className="flex ml-22 gap-x-10">
          <Link to="/" className="header-link reddit-regular">
            Home
          </Link>
          <Link to="/flights" className="header-link reddit-regular">
            Flights
          </Link>
          <Link to="/destinations" className="header-link reddit-regular">
            Destinations
          </Link>
          <Link to="/news" className="header-link reddit-regular">
            News
          </Link>
        </div>
      </div>

      <div className="flex items-center mr-10 gap-x-4">
        <div
          className={`${isAtTop ? "opacity-0" : "opacity-100"}
                        transition-opacity duration-300`}
        >
          <WeatherDisplay />
        </div>
        {
          user ? (
            <UserAvatarButton user={user} />
          ) : isLoading ? (
            <p>Logging in...</p>
          ) : (
            <AuthButtons />
          )
        }
      </div>
    </div>
  );
}

const UserAvatarButton = ({ user }: { user: User }) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onLogout = () => {
    clientApi.logout();
    window.location.reload();
    toast.success("Đăng xuất thành công!");
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer w-10 h-10 border-2 border-gray-300 hover:border-blue-400 transition-all duration-150">
            <AvatarImage src="/miscs/default-user.jpg" alt="User Avatar" />
            <AvatarFallback>
              {user.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 dark" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Xem lịch sử đặt vé
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setLogoutDialogOpen(true);
                setDropdownOpen(false); // đóng menu trước khi mở dialog
              }}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={logoutDialogOpen}
        onOpenChange={(open) => {
          setLogoutDialogOpen(open);
          if (!open) setDropdownOpen(false); // chắc cú: khi đóng dialog thì dropdown cũng đóng
        }}
      >
        <AlertDialogContent className="w-100">
          <AlertDialogHeader>
            Bạn có chắc chắn muốn đăng xuất không?
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>Có</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

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

const AuthButtons = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>("login");
  const [showPassword, setShowPassword] = useState(false);
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
    // Reset forms when opening
    loginForm.reset();
    signupForm.reset();
  };

  function onLogin(data: z.infer<typeof loginFormSchema>): void {
    console.log(data);
    setIsSubmitting(true);
    toast.promise(
      clientApi.login(data.username, data.password),
      {
        loading: 'Vui lòng chờ...',
        success: (_) => {
          window.location.reload();
          return 'Đăng nhập thành công!';
        },
        error: (err) => {
          console.log(err);
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
    // Placeholder for signup API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setCurrentTab("login");
    }, 2000);
  }

  return (
    <>
      <button
        onClick={() => handleOpenDialog("login")}
        className="header-link reddit-regular ml-5 text-white hover:text-pink-300 transition-colors duration-200"
      >
        Log in
      </button>

      <p className="reddit-regular text-base select-none text-white/60">|</p>

      <button
        onClick={() => handleOpenDialog("signup")}
        className="cursor-pointer reddit-regular text-base bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 
          border border-pink-500 rounded-xl py-2 px-4 text-white 
          hover:border-pink-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        Sign up
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-pink-900/60 to-purple-900/80"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <DialogHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <Plane className="w-8 h-8 text-pink-300" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-bold text-white mb-2">
                Welcome to QAirline!
              </DialogTitle>
              <p className="text-gray-300">
                {currentTab === "login" ? "Đăng nhập để bắt đầu hành trình của bạn" : "Tạo tài khoản để khám phá thế giới"}
              </p>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabType)}>
              <TabsList className="grid grid-cols-2 mb-8 bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
                <TabsTrigger 
                  value="login" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-300 font-medium"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Đăng nhập
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-300 font-medium"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Đăng ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <UserIcon className="w-4 h-4" />
                            <span>Tên đăng nhập</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                className="pl-4 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Mật khẩu</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                className="pl-4 pr-12 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
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
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang đăng nhập...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <UserIcon className="w-5 h-5" />
                          <span>Đăng nhập</span>
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-0">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-5">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-4 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <UserIcon className="w-4 h-4" />
                            <span>Tên đăng nhập</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập tên đăng nhập"
                              className="pl-4 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Mật khẩu</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-4 pr-12 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Nhập lại mật khẩu</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-4 pr-12 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-pink-300 transition-all duration-200 rounded-xl h-12"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang tạo tài khoản...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Tạo tài khoản</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            {/* Enhanced Footer */}
            <div className="text-center mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse delay-300"></div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <span className="text-pink-300 hover:text-pink-200 cursor-pointer transition-colors duration-200">
                  điều khoản sử dụng
                </span>
                {" "}và{" "}
                <span className="text-pink-300 hover:text-pink-200 cursor-pointer transition-colors duration-200">
                  chính sách bảo mật
                </span>
                {" "}của chúng tôi
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
