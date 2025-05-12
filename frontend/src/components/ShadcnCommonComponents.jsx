import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ShadcnCommonComponents = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Click me</Button>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" className="w-full" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">Message</Label>
        <Textarea id="message" placeholder="Enter your message..." className="w-full" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="switch">Enable notifications</Label>
        <Switch id="switch" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="select">Choose an option</Label>
        <Select>
          <SelectTrigger id="select" className="w-full">
            <SelectValue placeholder="Select one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Dialog Title</DialogTitle>
            <DialogDescription>This is a dialog description.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Alert className="bg-yellow-100 border-yellow-300 text-yellow-800">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is an alert component.</AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the card content.</p>
        </CardContent>
        <CardFooter>
          <Button>Card Action</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex space-x-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-4">Account settings here.</TabsContent>
        <TabsContent value="password" className="mt-4">Change your password here.</TabsContent>
      </Tabs>

      <Badge variant="default" className="text-xs bg-green-500">Default Badge</Badge>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Accordion Title</AccordionTrigger>
          <AccordionContent>This is the content inside the accordion.</AccordionContent>
        </AccordionItem>
      </Accordion>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">This is a popover content</PopoverContent>
      </Popover>

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>This is a tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div>
        <Label className="block mb-2">Progress</Label>
        <Progress value={65} className="w-full h-4" />
      </div>

      <Separator className="my-6" />

      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <span>Avatar Component</span>
      </div>

      <div>
        <Label className="block mb-2">Skeleton</Label>
        <Skeleton className="h-6 w-1/2 rounded" />
      </div>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">Hover card</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          Info shown on hover
        </HoverCardContent>
      </HoverCard>

      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
          <p>This is the sheet content</p>
        </SheetContent>
      </Sheet>

      <div>
        <Label className="block mb-2">Calendar</Label>
        <p>See more <a href="https://date-picker.luca-felix.com/" className=" hover:text-red-600">this link</a>.</p>
      </div>

      <div>
        <Label className="block mb-2">Command Palette</Label>
        <Command className="border rounded-md">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Option A</CommandItem>
            <CommandItem>Option B</CommandItem>
            <CommandItem>Option C</CommandItem>
          </CommandList>
        </Command>
      </div>

      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a toast notification.</ToastDescription>
        </Toast>
      </ToastProvider>
    </div>
  );
};

export default ShadcnCommonComponents;
