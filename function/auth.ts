import * as SecureStore from "expo-secure-store";

const getToken = async () => {
    const token = await SecureStore.getItemAsync("login");
    return token;
};

const saveToken = async (token:string) => {
    await SecureStore.setItemAsync("login", token);
};

export const check_login = async (): Promise<boolean|number> => {
    const get_token = getToken();
    if (!get_token) return false;
    try {

        return false;
    } catch (error) {
        return 500;
    }
};

export const login_user = async () => {
    try {
    //     LOGIN USER
    } catch (error) {
        return 500;
    }
};