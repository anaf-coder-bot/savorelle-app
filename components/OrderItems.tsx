import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, {useState} from 'react'
import { CircleCheckBig, BanknoteIcon } from "lucide-react-native";

type Status = "pending" | "preparing" | "serving" | "paying" | "done" | "delay";

type Order = {
    id: string;
    customer_name: string;
    table_no: number;
    status: Status;
    items: string[];
    price: number;
    tip: number;
    cash: boolean;
    setData?: React.Dispatch<React.SetStateAction<Record<string, Order>>>
};

type OrderProps = Order & {
    setData: React.Dispatch<React.SetStateAction<Record<string, Order>>>
}

const STATUS_COLOR: Record<Status, string> = {
    pending: "bg-yellow-300",
    preparing: "bg-purple-400",
    serving: "bg-blue-400",
    paying: "bg-orange-400",
    done: "bg-green-400",
    delay: "bg-red-400",
};

const OrderItems = ({ id, customer_name, table_no, status, items, price, tip, cash, setData } : OrderProps) => {

    const [loading, setLoading] = useState<boolean>(false);

    const handle_serving = async () => {

    };

    const handle_cash = async () => {

    };

    return (
        <View className={'border p-5 rounded-lg gap-5'}>
            <View className={'flex-row items-center gap-5'}>
                <Text className={'capitalize font-quicksand-bold text-2xl'}>{customer_name}</Text>
                <Text className={`capitalize ${STATUS_COLOR[status]} p-2 rounded-full text-white font-quicksand-semibold`}>{status}</Text>
            </View>
            <Text className={'bg-black text-white font-quicksand-semibold p-3 rounded-full self-start'}>Table {table_no}</Text>
            <Text className={'text-gray-400 font-quicksand-bold border-b'}>Orders</Text>
            <FlatList
                data={items}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({item}) => (
                    <View className={'flex-1 p-2'}>
                        <Text className={'font-quicksand-semibold'}>• {item}</Text>
                    </View>
                )}
            />
            <View className={'border-b w-full'}/>
            <Text className={'font-quicksand-bold'}>Price: {price.toLocaleString()} ETB</Text>
            {
                status==="serving" ? (
                    <TouchableOpacity className={`p-3 rounded-full flex-row justify-center items-center gap-3 ${loading ? 'bg-gray-400' : STATUS_COLOR[status]}`} onPress={handle_serving} disabled={loading}>
                        <Text className={'text-white text-lg font-quicksand-semibold'}>Served</Text>
                        {loading ? <ActivityIndicator /> : <CircleCheckBig color={'white'}/> }
                    </TouchableOpacity>
                ) : status==="paying" ? (
                    <TouchableOpacity className={`p-3 rounded-full flex-row justify-center items-center gap-3 ${loading ? 'bg-gray-400' : STATUS_COLOR[status]}`} onPress={handle_cash} disabled={loading}>
                        <Text className={'text-white font-quicksand-semibold'}>Pay with Cash</Text>
                        {loading ? <ActivityIndicator /> : <BanknoteIcon color={'white'}/> }
                    </TouchableOpacity>
                ) : status==="done" && (
                    <View>
                        <Text className={'font-quicksand-bold text-lg'}>Payment Method: {cash?"Cash":"System"}</Text>
                        {
                            !!tip && <Text>Tip: {tip} ETB</Text>
                        }
                    </View>
                )
            }

        </View>
    )
}
export default OrderItems
