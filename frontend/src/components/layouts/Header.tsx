import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@/services/schemes/auth";
import { useServices } from "@/context/ServiceContext";
import { WeatherDisplay } from "@/components/layouts/Weather";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/services/client/main";
import { AuthButtons } from "@/components/auth/AuthButtons";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Ticket,
  LogOut,
  MoreHorizontal,
  Home,
  Globe,
  Newspaper,
  Plane
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";

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
    // { to: "/", label: "Home", icon: Home },
    { to: "/flights", label: "Chuyến bay", icon: Plane },
    { to: "/destinations", label: "Điểm đến", icon: Globe },
    { to: "/news", label: "Tin tức", icon: Newspaper },
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
