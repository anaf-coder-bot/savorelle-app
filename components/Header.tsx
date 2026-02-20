import {View, Text, TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext';

const Header = () => {
    const { logout, user } = useContext(AuthContext);
    return (
        <View className={'bg-black w-full p-7 flex-row items-center justify-between rounded-t-2xl'}>
            <Text className={'text-white font-quicksand-bold text-lg capitalize'}>Welcome, {user?.username}</Text>
            <TouchableOpacity onPress={() => logout()}>
                <Text className='text-red-400'>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Header
