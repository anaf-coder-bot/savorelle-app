import * as SecureStorage from "expo-secure-store";

const Access_KEY = "accessToken";
const Refresh_KEY = "refreshToken";
const Username_Key = "username";
const Role_Key = "role";

export interface User {
  username: string;
  role: string;
}

export async function setAccessToken(token: string): Promise<void> {
  await SecureStorage.setItemAsync(Access_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  return await SecureStorage.getItemAsync(Access_KEY);
}

export async function setUser(user: User): Promise<void> {
  await SecureStorage.setItemAsync(Username_Key, user.username);
  await SecureStorage.setItemAsync(Role_Key, user.role);
}

export async function getUser(): Promise<User | null> {

  const username = await SecureStorage.getItemAsync(Username_Key);
  const role = await SecureStorage.getItemAsync(Role_Key);

  // If either is missing, user is not valid
  if (!username || !role) {
    return null;
  }

  return {
    username,
    role,
  };
}

export async function setRefreshToken(token: string): Promise<void> {
  await SecureStorage.setItemAsync(Refresh_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return await SecureStorage.getItemAsync(Refresh_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStorage.deleteItemAsync(Access_KEY);
  await SecureStorage.deleteItemAsync(Refresh_KEY);
  await SecureStorage.deleteItemAsync(Username_Key);
  await SecureStorage.deleteItemAsync(Role_Key);
}
