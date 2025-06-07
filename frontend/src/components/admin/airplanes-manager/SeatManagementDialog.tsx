import { z } from "zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { adminApi } from "@/services/admin/main";
import { clientApi } from "@/services/client/main";
import toast from "react-hot-toast";
import { PlaneType } from "@/services/schemes/planes";
import { Trash2, Plus, Edit } from "lucide-react";

const seatConfigSchema = z.object({
  row: z.number().min(1).optional(),
  start_row: z.number().min(1).optional(),
  end_row: z.number().min(1).optional(),
  num_seats_per_row: z.number().min(1).max(26),
  class: z.enum(['economy', 'business', 'first']),
});

const seatUpdateSchema = z.object({
  row: z.number().min(1).optional(),
  start_row: z.number().min(1).optional(),
  end_row: z.number().min(1).optional(),
  num_seats_per_row: z.number().min(1).max(26).optional(),
  class: z.enum(['economy', 'business', 'first']).optional(),
});

const seatDeleteSchema = z.object({
  row: z.number().min(1).optional(),
  start_row: z.number().min(1).optional(),
  end_row: z.number().min(1).optional(),
});

type SeatManagementDialogProps = {
  children: ReactNode;
  plane: PlaneType;
  updatePlaneStateAction: (plane: PlaneType) => void;
};

type SeatConfigurationType = {
  airplane_id: number;
  start_row: number;
  end_row: number;
  num_seats_per_row: number;
  class: 'economy' | 'business' | 'first';
};

export const SeatManagementDialog = ({ 
  children, 
  plane,
  updatePlaneStateAction 
}: SeatManagementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seatConfigurations, setSeatConfigurations] = useState<SeatConfigurationType[]>([]);

  const configForm = useForm<z.infer<typeof seatConfigSchema>>({
    resolver: zodResolver(seatConfigSchema),
    defaultValues: {
      num_seats_per_row: 6,
      class: 'economy',
    },
  });

  const updateForm = useForm<z.infer<typeof seatUpdateSchema>>({
    resolver: zodResolver(seatUpdateSchema),
  });

  const deleteForm = useForm<z.infer<typeof seatDeleteSchema>>({
    resolver: zodResolver(seatDeleteSchema),
  });

  const fetchSeatConfigurations = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getAirplaneSeats(plane.airplane_id);
      setSeatConfigurations(data);
    } catch (error) {
      console.error('Error fetching seat configurations:', error);
      toast.error('Lỗi khi tải cấu hình ghế');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSeatConfigurations();
    }
  }, [open]);

  const onConfigureSubmit = async (values: z.infer<typeof seatConfigSchema>) => {
    try {
      await toast.promise(
        adminApi.configureSeatLayout(plane.airplane_id, values),
        {
          loading: "Đang cấu hình ghế...",
          success: (response) => {
            fetchSeatConfigurations();
            configForm.reset();
            // Refresh plane data by fetching updated plane info
            // We'll use total_seats_created to estimate the new total
            return response.message || "Cấu hình ghế thành công!";
          },
          error: (err) => {
            const errorMsg = err.response?.data?.message || "Lỗi khi cấu hình ghế";
            return errorMsg;
          }
        }
      );
      // Refetch plane data to get updated total_seats
      try {
        const updatedPlane = await clientApi.getPlane(plane.airplane_id);
        updatePlaneStateAction(updatedPlane);
      } catch (error) {
        console.error('Error fetching updated plane data:', error);
      }
    } catch (error) {
      console.error('Error configuring seats:', error);
    }
  };

  const onUpdateSubmit = async (values: z.infer<typeof seatUpdateSchema>) => {
    try {
      await toast.promise(
        adminApi.updateSeatsByRow(plane.airplane_id, values),
        {
          loading: "Đang cập nhật ghế...",
          success: (response) => {
            fetchSeatConfigurations();
            updateForm.reset();
            return response.message || "Cập nhật ghế thành công!";
          },
          error: (err) => {
            const errorMsg = err.response?.data?.message || "Lỗi khi cập nhật ghế";
            return errorMsg;
          }
        }
      );
      // Refetch plane data to get updated total_seats if seats were recreated
      try {
        const updatedPlane = await clientApi.getPlane(plane.airplane_id);
        updatePlaneStateAction(updatedPlane);
      } catch (error) {
        console.error('Error fetching updated plane data:', error);
      }
    } catch (error) {
      console.error('Error updating seats:', error);
    }
  };

  const onDeleteSubmit = async (values: z.infer<typeof seatDeleteSchema>) => {
    try {
      await toast.promise(
        adminApi.deleteSeatsByRow(plane.airplane_id, values),
        {
          loading: "Đang xóa ghế...",
          success: (response) => {
            fetchSeatConfigurations();
            deleteForm.reset();
            // Update total seats from response
            if (response.remaining_total_seats !== undefined) {
              const updatedPlane = { ...plane, total_seats: response.remaining_total_seats };
              updatePlaneStateAction(updatedPlane);
            }
            return response.message || "Xóa ghế thành công!";
          },
          error: (err) => {
            const errorMsg = err.response?.data?.message || "Lỗi khi xóa ghế";
            return errorMsg;
          }
        }
      );
    } catch (error) {
      console.error('Error deleting seats:', error);
    }
  };

  const getClassBadgeColor = (seatClass: string) => {
    switch (seatClass) {
      case 'first':
        return 'bg-purple-100 text-purple-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'economy':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassLabel = (seatClass: string) => {
    switch (seatClass) {
      case 'first':
        return 'Hạng nhất';
      case 'business':
        return 'Hạng thương gia';
      case 'economy':
        return 'Hạng phổ thông';
      default:
        return seatClass;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý ghế máy bay - {plane.code}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Seat Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cấu hình ghế hiện tại</h3>
            {isLoading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : seatConfigurations.length > 0 ? (
              <div className="grid gap-3">
                {seatConfigurations.map((config, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge className={getClassBadgeColor(config.class)}>
                        {getClassLabel(config.class)}
                      </Badge>
                      <span className="text-sm">
                        Hàng {config.start_row}
                        {config.start_row !== config.end_row && ` - ${config.end_row}`}
                      </span>
                      <span className="text-sm text-gray-600">
                        {config.num_seats_per_row} ghế/hàng
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Tổng: {(config.end_row - config.start_row + 1) * config.num_seats_per_row} ghế
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Chưa có cấu hình ghế nào
              </div>
            )}
          </div>

          {/* Seat Management Tabs */}
          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">Tạo mới</TabsTrigger>
              <TabsTrigger value="update">Cập nhật</TabsTrigger>
              <TabsTrigger value="delete">Xóa</TabsTrigger>
            </TabsList>

            {/* Configure Tab */}
            <TabsContent value="configure" className="space-y-4">
              <Form {...configForm}>
                <form onSubmit={configForm.handleSubmit(onConfigureSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={configForm.control}
                      name="row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng đơn (tùy chọn)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 5"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  configForm.setValue('start_row', undefined);
                                  configForm.setValue('end_row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">HOẶC</div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={configForm.control}
                      name="start_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng bắt đầu</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 1"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  configForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={configForm.control}
                      name="end_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng kết thúc</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 20"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  configForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={configForm.control}
                      name="num_seats_per_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số ghế mỗi hàng</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={26}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={configForm.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hạng ghế</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn hạng ghế" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="economy">Hạng phổ thông</SelectItem>
                              <SelectItem value="business">Hạng thương gia</SelectItem>
                              <SelectItem value="first">Hạng nhất</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo cấu hình ghế
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Update Tab */}
            <TabsContent value="update" className="space-y-4">
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng đơn (tùy chọn)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 5"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  updateForm.setValue('start_row', undefined);
                                  updateForm.setValue('end_row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">HOẶC</div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="start_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng bắt đầu</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 1"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  updateForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name="end_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng kết thúc</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 20"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  updateForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={updateForm.control}
                      name="num_seats_per_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số ghế mỗi hàng (tùy chọn)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={26}
                              placeholder="Không thay đổi nếu để trống"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hạng ghế (tùy chọn)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Không thay đổi nếu không chọn" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="economy">Hạng phổ thông</SelectItem>
                              <SelectItem value="business">Hạng thương gia</SelectItem>
                              <SelectItem value="first">Hạng nhất</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật cấu hình ghế
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Delete Tab */}
            <TabsContent value="delete" className="space-y-4">
              <Form {...deleteForm}>
                <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      ⚠️ Cảnh báo: Việc xóa ghế sẽ không thể hoàn tác. Chỉ có thể xóa những ghế chưa được đặt.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={deleteForm.control}
                      name="row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng đơn (tùy chọn)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 5"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  deleteForm.setValue('start_row', undefined);
                                  deleteForm.setValue('end_row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">HOẶC</div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={deleteForm.control}
                      name="start_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng bắt đầu</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 1"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  deleteForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={deleteForm.control}
                      name="end_row"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hàng kết thúc</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ví dụ: 20"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                                if (value) {
                                  deleteForm.setValue('row', undefined);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa ghế
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 