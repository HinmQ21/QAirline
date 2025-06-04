import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WeatherDisplay } from "@/components/layouts/Weather";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/services/schemes/auth";
import { useServices } from "@/context/ServiceContext";

type TabType = "login" | "signup";

const AuthButtons = ({ isLoading }: { isLoading: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>("login");

  const handleOpenDialog = (tab: TabType) => {
    setIsOpen(true);
    setCurrentTab(tab);
  };

  return (
    <>
      <button
        onClick={() => handleOpenDialog("login")}
        className="header-link poppins-regular ml-5"
        disabled={isLoading}
      >
        Log in
      </button>

      <p className="poppins-regular text-base select-none">|</p>

      <button
        onClick={() => handleOpenDialog("signup")}
        className="cursor-pointer
          poppins-regular text-base bg-red-500
          border border-black rounded-xl py-2 px-3
          hover:border-white transition-all duration-150
        "
        disabled={isLoading}
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
            <TabsList className="grid grid-cols-2 mb-4 poppins-regular">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white">
                  Đăng nhập
                </Button>
              </form>
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

interface HeaderProps {
  isAtTop?: boolean;
  className?: string;
}

export const Header = ({ isAtTop = false, className = "" }: HeaderProps) => {
  const { userContext } = useServices();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    userContext.getchUser().then(
      (fetchedUser) => {
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
          <Link to="/" className="header-link poppins-regular">
            Home
          </Link>
          <Link to="/flights" className="header-link poppins-regular">
            Flights
          </Link>
          <Link to="/destinations" className="header-link poppins-regular">
            Destinations
          </Link>
          <Link to="/contact" className="header-link poppins-regular">
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
            <div></div>
          ) : (
            <AuthButtons isLoading={isLoading} />
          )
        }
      </div>
    </div>
  );
}
