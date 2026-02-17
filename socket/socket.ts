import { io, Socket } from "socket.io-client";
import { getUser } from "@/utils/tokenStorage";

export let socket: Socket;

export const connectSocket = async () => {
    // Create socket instance
    const user = await getUser();
    socket = io("http://192.168.1.4:3000", {
    auth: { username:user?.username }, // send username instead of token
    autoConnect: false, // connect manually
    });
    return socket;
};