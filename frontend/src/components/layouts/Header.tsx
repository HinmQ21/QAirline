import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { User } from "@/services/schemes/auth";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/services/client/main";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServices } from "@/context/ServiceContext";
import { WeatherDisplay } from "@/components/layouts/Weather";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Plane,
  Shield,
  Ticket,
  LogOut,
  MoreHorizontal,
  Home,
  Globe,
  Newspaper
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";

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

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/flights", label: "Flights", icon: Plane },
    { to: "/destinations", label: "Destinations", icon: Globe },
    { to: "/news", label: "News", icon: Newspaper },
  ];

  const navigate = useNavigate();

  return (
    <div className={`header ${isAtTop ? "header-top" : "header-scrolled"} ${className}`}>
      <div className="flex items-center ml-10">
        <Link to="/" className="special-gothic-expanded-one-regular text-2xl">
          QAIRLINE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex ml-10 lg:ml-22 gap-x-10">
          {navigationLinks.map((link) => (
            <Link key={link.to} to={link.to} className="header-link reddit-regular">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden ml-5 sm:ml-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-red-600">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-gray-900/95 backdrop-blur-sm border border-gray-800"
            >
              <DropdownMenuGroup>
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem
                      key={link.to}
                      className="cursor-pointer text-gray-200 hover:text-white focus:text-white hover:bg-gray-800/80 focus:bg-gray-800/80 group"
                      onClick={() => navigate(link.to)}
                    >
                      <Icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-red-500 group-focus:text-red-500" />
                      {link.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center mr-10 gap-x-4">
        {/* Weather info - hidden on mobile */}
        <div
          className={`${isAtTop ? "opacity-0" : "opacity-100"}
                        min-w-max
                        transition-opacity duration-300`}
        >
          <WeatherDisplay />
        </div>

        {user ? (
          <UserAvatarButton user={user} />
        ) : isLoading ? (
          <p>Logging in...</p>
        ) : (
          <AuthButtons />
        )}
      </div>
    </div>
  );
}

const UserAvatarButton = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onLogout = () => {
    clientApi.logout();
    navigate('/');
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
            <DropdownMenuItem
              onClick={() => {
                navigate('/profile');
                setDropdownOpen(false);
              }}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate('/bookings');
                setDropdownOpen(false);
              }}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Xem lịch sử đặt vé
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setLogoutDialogOpen(true);
                setDropdownOpen(false); // đóng menu trước khi mở dialog
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
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
