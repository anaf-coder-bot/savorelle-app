import {View, Text, TextInput, TouchableOpacity} from 'react-native'
import React, {useContext, useState} from 'react'
import { Key } from "lucide-react-native"
import { AuthContext } from '@/context/AuthContext';

type Data = {
    username: string;
    password: string;
    error: string;
};

const LogIn = () => {

    const { login } = useContext(AuthContext);

    const [data, setData] = useState<Data>({
        username: "",
        password: "",
        error: ""
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handle_login = async () : Promise<void> => {
        if (!data.username || !data.password || loading) return;
        setLoading(true);
        try {
            const req = await fetch(`http://192.168.1.4:3000/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username:data.username, password:data.password, client:"app"}),
            });
            const res = await req.json();
            if (!req.ok) {
                setData(prev => ({...prev, error:res.msg}));
            } else {
                const { accessToken, refreshToken, user }:{accessToken:string, refreshToken:string, user:{username:string, role:string}} = res;
                login({accessToken, refreshToken, user});
            };
        } catch(error) {
            console.error(error as string);
            setData(prev => ({...prev, error:"Something went wrong, try again."}));
        };
        setLoading(false);

    };

    return (
        <View className={'flex items-center justify-center gap-3 h-screen p-3 font-quicksand'}>
            <Text className={'font-quicksand-bold text-3xl'}>Welcome to Savorelle</Text>
            <Text className={'text-gray-400 font-quicksand-lights'}>Login to your account</Text>
            <Text className={'text-red-400'}>{data.error}</Text>
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
