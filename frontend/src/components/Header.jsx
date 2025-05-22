import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { WeatherDisplay } from "./Weather";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";


const _AuthButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("login");

  const handleOpenDialog = (tab) => {
    setIsOpen(true);
    setCurrentTab(tab);
  };

  return (
    <>
      <button
        onClick={() => handleOpenDialog("login")}
        className="header-link poppins-regular ml-5"
      >Log in</button>

      <p className="poppins-regular text-base select-none">|</p>

      <button
        onClick={() => handleOpenDialog("signup")}
        className="cursor-pointer
        poppins-regular text-base bg-red-500
        border border-black rounded-xl py-2 px-3
        hover:border-white transition-all duration-150
      ">Sign up</button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold inter-bold">Welcome back!</DialogTitle>
          </DialogHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
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
                <Button type="submit" className="w-full bg-blue-600 text-white">Đăng nhập</Button>
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
                <Button type="submit" className="w-full bg-green-600 text-white">Đăng ký</Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}


export const Header = ({ isAtTop = false, className = "" }) => (
  <div className={
    `header ${isAtTop ? 'header-top' : 'header-scrolled'} ${className}`
  }>
    <div className="flex items-center ml-10">
      <Link to="/" className="special-gothic-expanded-one-regular text-2xl">QAIRLINE</Link>
      <div className="flex ml-22 gap-x-10">
        <Link to="/" className="header-link poppins-regular">Home</Link>
        <Link to="/flights" className="header-link poppins-regular">Flights</Link>
        <Link to="/destinations" className="header-link poppins-regular">Destinations</Link>
        <Link to="/contact" className="header-link poppins-regular">Contact</Link>
      </div>
    </div>


    <div className="flex items-center mr-10 gap-x-4">
      <div className={`${isAtTop ? 'opacity-0' : 'opacity-100'}
                       transition-opacity duration-300`} op>
        <WeatherDisplay />
      </div>
      <_AuthButtons />
    </div>
  </div>
)
