import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { CircleCheckBig, BanknoteIcon } from "lucide-react-native";
import { Order, Status } from "@/app/(tabs)/index";

type OrderItemsProps = {
  order: Order;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  handleStatusUpdate: (id: string, status: Status) => Promise<void>;
};

const STATUS_COLOR: Record<Status, string> = {
  pending: "bg-yellow-300",
  preparing: "bg-purple-400",
  serving: "bg-blue-400",
  paying: "bg-orange-400",
  done: "bg-green-400",
};

export default function OrderItems({ order, handleStatusUpdate }: OrderItemsProps) {
  const [loading, setLoading] = useState(false);

  const handleServing = async () => {
    setLoading(true);
    await handleStatusUpdate(order.id, "done");
    setLoading(false);
  };

  const handleCash = async () => {
    setLoading(true);
    await handleStatusUpdate(order.id, "done");
    setLoading(false);
  };

  return (
    <View className="border p-5 rounded-lg gap-5 bg-white shadow">
      {/* Header */}
      <View className="flex-row items-center gap-5">
        <Text className="capitalize font-bold text-2xl">{order.customer_name}</Text>
        <Text className={`capitalize ${STATUS_COLOR[order.status]} p-2 rounded-full text-white font-semibold`}>
          {order.status}
        </Text>
      </View>

      <Text className="bg-black text-white font-semibold p-3 rounded-full self-start">
        Table {order.table_no}
      </Text>

      {/* Items */}
      <Text className="text-gray-400 font-bold border-b mt-2">Orders</Text>
      {order.items.map((item, idx) => (
        <Text key={idx} className="font-semibold">
          • {item.quantity} × {item.name}
        </Text>
      ))}

      <View className="border-b w-full my-2" />

      <Text className="font-bold">Price: {Number(order.price).toLocaleString()} ETB</Text>

      {/* Status buttons */}
      {order.status === "serving" && (
        <TouchableOpacity
          className={`p-3 rounded-full flex-row justify-center items-center gap-3 ${loading ? "bg-gray-400" : STATUS_COLOR[order.status]}`}
          onPress={handleServing}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">Served</Text>
          {loading && <ActivityIndicator color="white" />}
          {!loading && <CircleCheckBig color="white" />}
        </TouchableOpacity>
      )}

      {order.status === "paying" && (
        <TouchableOpacity
          className={`p-3 rounded-full flex-row justify-center items-center gap-3 ${loading ? "bg-gray-400" : STATUS_COLOR[order.status]}`}
          onPress={handleCash}
          disabled={loading}
        >
          <Text className="text-white font-semibold">Pay with Cash</Text>
          {loading && <ActivityIndicator color="white" />}
          {!loading && <BanknoteIcon color="white" />}
        </TouchableOpacity>
      )}

      {order.status === "done" && (
        <View>
          <Text className="font-bold text-lg">Payment Method: {order.cash ? "Cash" : "System"}</Text>
          {!!order.tip && <Text>Tip: {order.tip} ETB</Text>}
        </View>
      )}
    </View>
  );
}
