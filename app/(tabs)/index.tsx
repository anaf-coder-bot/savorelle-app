import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "@/components/Header";
import OrderItems from "@/components/OrderItems";
import { LucideRefreshCw } from "lucide-react-native";

type Status = "pending" | "preparing" | "serving" | "paying" | "done" | "delay";

type Orders = {
    id: string;
    customer_name: string;
    table_no: number;
    status: Status;
    items: string[];
    price: number;
    tip: number;
    cash: boolean;
};

export default function Index() {

    const [data, setData] = useState<Record<string, Orders>>({
        "123": {
            id: "123",
            table_no: 123,
            cash: false,
            price: 10000,
            status: "pending",
            items: ["chicken", "burger", "pizza", "coffe"],
            tip: 0,
            customer_name: "Anaf"
        },
        "234": {
            id: "234",
            table_no: 123,
            cash: false,
            price: 10000,
            status: "preparing",
            items: ["chicken", "burger", "pizza", "coffe"],
            tip: 0,
            customer_name: "Anaf"
        },
        "345": {
            id: "345",
            table_no: 123,
            cash: false,
            price: 10000,
            status: "serving",
            items: ["chicken", "burger", "pizza", "coffe"],
            tip: 0,
            customer_name: "Anaf"
        },
        "456": {
            id: "456",
            table_no: 123,
            cash: false,
            price: 10000,
            status: "paying",
            items: ["chicken", "burger", "pizza", "coffe"],
            tip: 0,
            customer_name: "Anaf"
        },
        "567": {
            id: "567",
            table_no: 123,
            cash: false,
            price: 10000,
            status: "done",
            items: ["chicken", "burger", "pizza", "coffe"],
            tip: 0,
            customer_name: "Anaf"
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [serverMsg, setServerMsg] = useState<string>("");
    const [updatedId, setUpdatedId] = useState<string>("");

    const get_data = async () => {
        if (loading) return;
        setLoading(true);
    };

    return (
        <SafeAreaView>
            <FlatList
                data={Object.values(data).sort(a => a.id===updatedId?-1:0)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OrderItems id={item.id} customer_name={item.customer_name}
                                                      table_no={item.table_no} status={item.status}
                                                      items={item.items} price={item.price}
                                                      tip={item.tip} cash={item.cash} setData={setData}/>}
                ListHeaderComponent={() => <Header name={"anaf"}/>}
                ListEmptyComponent={() =>loading ? <ActivityIndicator size={50} color={"black"} /> : (
                        <View className={'items-center justify-center gap-5 p-5'}>
                            <Text>{serverMsg || "Try again."}</Text>
                            <TouchableOpacity className={'flex-row items-center justify-center gap-5 bg-black p-3 rounded-full'} onPress={get_data}>
                                <Text className={'text-white'}>Try again</Text>
                                <LucideRefreshCw color={'white'} />
                            </TouchableOpacity>
                        </View>
                    )}
                contentContainerClassName={'px-4 pb-10 gap-5'}
            />
        </SafeAreaView>
    )
}
