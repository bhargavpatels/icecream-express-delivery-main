import { useMutation, useQuery } from '@tanstack/react-query';
import { placeOrder, fetchOrderHistory, trackOrder, cancelOrder, OrderRequest } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export const usePlaceOrder = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (orderData: OrderRequest) => placeOrder(orderData),
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${data.orderId} has been confirmed. Estimated delivery: ${data.estimatedDelivery}`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
};

export const useOrderHistory = (phone: string) => {
  return useQuery({
    queryKey: ['orderHistory', phone],
    queryFn: () => fetchOrderHistory(phone),
    enabled: !!phone, // Only run query if phone is provided
  });
};

export const useTrackOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['trackOrder', orderId],
    queryFn: () => trackOrder(orderId),
    enabled: !!orderId, // Only run query if orderId is provided
    refetchInterval: 30000, // Refetch every 30 seconds to get updates
  });
};

export const useCancelOrder = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      toast({
        title: "Order Cancelled Successfully!",
        description: "Your order has been cancelled.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel order",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
};
