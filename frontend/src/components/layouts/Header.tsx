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
          <Link to="/contact" className="header-link reddit-regular">
            Contact
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

const AuthButtons = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>("login");

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleOpenDialog = (tab: TabType) => {
    setIsOpen(true);
    setCurrentTab(tab);
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

  return (
    <>
      <button
        onClick={() => handleOpenDialog("login")}
        className="header-link reddit-regular ml-5"
      >
        Log in
      </button>

      <p className="reddit-regular text-base select-none">|</p>

      <button
        onClick={() => handleOpenDialog("signup")}
        className="cursor-pointer
          reddit-regular text-base bg-red-500
          border border-black rounded-xl py-2 px-3
          hover:border-white transition-all duration-150
        "
      >
        Sign up
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold inter-bold">
              Welcome back!
            </DialogTitle>
          </DialogHeader>
          <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabType)}>
            <TabsList className="grid grid-cols-2 mb-4 reddit-regular">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className={`w-full ${isSubmitting ? "bg-gray-400" : "bg-blue-600"} text-white`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="new-email">Email</Label>
                  <Input id="new-email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="new-password">Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Re-type Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full bg-green-600 text-white">
                  Đăng ký
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
