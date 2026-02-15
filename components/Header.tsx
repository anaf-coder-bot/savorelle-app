import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { UserRoundSearchIcon } from "lucide-react-native"
import {router} from "expo-router";

const Header = ({name}: {name:string}) => {
    return (
        <View className={'bg-black w-full p-7 flex-row items-center justify-between rounded-t-2xl'}>
            <Text className={'text-white font-quicksand-bold text-lg capitalize'}>Welcome, {name}</Text>
            <TouchableOpacity
                className={'bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center'}
                onPress={() => router.push("/profile")}
            >
                <UserRoundSearchIcon />
            </TouchableOpacity>
        </View>
    )
}
export default Header
