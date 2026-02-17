import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import OrderItems from "@/components/OrderItems";
import { LucideRefreshCw } from "lucide-react-native";
import { connectSocket, socket } from "@/socket/socket"; // your socket instance
import { useApi } from "@/func/api/api";

export type Status = "pending" | "preparing" | "serving" | "paying" | "done";

export type Order = {
  id: string;
  customer_name: string;
  table_no: string | number;
  status: Status;
  items: { name: string; quantity: number }[];
  price: number;
  tip?: number;
  cash?: boolean;
};

export default function WaiterOrders() {
  const { request } = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string>("");
  const loadingRef = useRef(false);

    useEffect(() => {
    getOrders();
    const initSocket = async () => {
    const s = await connectSocket(); // wait for username
    s.connect(); // now connect safely
    s.emit("join-waiter");

    s.on("new-order", (order: Order) => {
        console.log("NEW ORDER")
        setOrders(prev => [order, ...prev]);
    });

    s.on("order-updated", (updatedOrder: Order) => {
        setOrders(prev =>
        prev.map(o => (o.id === updatedOrder.id ? {...o, status:updatedOrder.status} : o)).filter(o => o.status !== "done")
        );
    });
    };

    initSocket();

    return () => {
    if (socket) {
        socket.off("new-order");
        socket.off("order-updated");
        socket.disconnect();
    }
    };
    }, []);


  // Fetch orders
  const getOrders = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const req = await request("/waiter/get-order"); // change to your API
      if (!req.ok || req.error) {
        
        const res = await req.json().catch(() => ({}));
        setServerMsg(req.error || res.msg || "Failed to fetch orders");
      } else {
        const res = await req.json();
        setOrders(res.order);
      }
    } catch (err: any) {
      setServerMsg(err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const handleStatusUpdate = async (id: string, status: Status) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const req = await request("/waiter/update-status", {
        method: "POST",
        body: JSON.stringify({ id, status }),
      });

      if (!req.ok || req.error) {
        const res = await req.json().catch(() => ({}));
        setServerMsg(req.error || res.msg || "Failed to update order");
      } else {
        const res = await req.json();
        const updatedOrder: Order = res.order;
        setOrders(prev =>
          prev.map(o => (o.id === id ? updatedOrder : o)).filter(o => o.status !== "done")
        );
      }
    } catch (err: any) {
      setServerMsg(err.message || "Error updating order");
    } finally {
      loadingRef.current = false;
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => <Header name="Anaf" />}
        ListEmptyComponent={() =>
          loading ? (
            <ActivityIndicator size={50} color="black" />
          ) : (
            <View className="items-center justify-center gap-5 p-5">
              <Text>{serverMsg || "No orders. Try again."}</Text>
              <TouchableOpacity
                className="flex-row items-center justify-center gap-5 bg-black p-3 rounded-full"
                onPress={getOrders}
              >
                <Text className="text-white">Try again</Text>
                <LucideRefreshCw color="white" />
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }) => (
          <OrderItems order={item} setOrders={setOrders} handleStatusUpdate={handleStatusUpdate} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}
      />
    </SafeAreaView>
  );
}
