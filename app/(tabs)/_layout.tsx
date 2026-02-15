import React from 'react'
import {Redirect, Slot} from "expo-router";

export default function _Layout() {
    const isAuthenticated = false;
    if (!isAuthenticated) return <Redirect href={"/log-in"} />
    return <Slot />
}
