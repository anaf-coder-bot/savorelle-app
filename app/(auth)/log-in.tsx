import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Key } from "lucide-react-native"
import {check_login, login_user} from "@/function/auth";
import {router} from "expo-router";

type Data = {
    username: string;
    password: string;
    error: string;
};

const LogIn = () => {

    const [data, setData] = useState<Data>({
        username: "",
        password: "",
        error: ""
    });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const check_user_login = async (): Promise<void> => {
            const res = await check_login();
            if (res===true) router.replace("/");
        };
        check_user_login().catch(error => {console.log(error)})
    }, []);

    const handle_login = async () : Promise<void> => {
        if (!data.username || !data.password || loading) return;
        setLoading(true);
        const res = await login_user();
        if (res === 500) setData(prev => ({...prev, error:"Something went wrong, try again."}));

    };

    return (
        <View className={'flex items-center justify-center gap-3 h-screen p-3 font-quicksand'}>
            <Text className={'font-quicksand-bold text-3xl'}>Welcome to Savorelle</Text>
            <Text className={'font-gray-400 font-quicksand-lights'}>Login to your account</Text>
            <View className={'border w-full'} />
            <Text className={'font-quicksand-semibold text-xl mt-5'}>Username</Text>
            <TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                className={'border w-full text-center rounded-2xl'}
                placeholder={"Username..."}
                value={data.username}
                onChangeText={text => setData(prev => ({...prev, username:text}))}
            />
            <Text className={'font-quicksand-semibold text-xl mt-5'}>Password</Text>
            <TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                className={'border w-full text-center rounded-2xl'}
                placeholder={"Password..."}
                secureTextEntry={true}
                value={data.password}
                onChangeText={text => setData(prev => ({...prev, password:text}))}
            />
            <TouchableOpacity className={'bg-black w-1/2 p-2 rounded-2xl'} onPress={handle_login}>
                {loading ?
                    <Text className={'text-gray-400 font-quicksand-bold text-center'}>Loading...</Text>
                : (
                    <View className={'flex flex-row items-center justify-center gap-2'}>
                        <Text className={'text-white font-quicksand-bold text-center'}>Login</Text>
                        <Key color={'white'}/>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}
export default LogIn
