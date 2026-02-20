// src/functions/api/api.ts
import { getAccessToken, getRefreshToken, setAccessToken, clearToken } from "@/utils/tokenStorage";

export type Status = "pending" | "preparing" | "serving" | "paying" | "done";

export type ApiResponse<T> = {
  ok: boolean;
  error?: string;
  json: () => Promise<T>;
};

export function useApi(baseURL: string = "http://192.168.1.6:3000") {
  // Core request
  const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {},
    retry: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
        const accessToken = await getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as object || {}),
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // If unauthorized, try refresh token
      if ((res.status === 401 || res.status === 403) && retry) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry original request with new access token
          return request<T>(endpoint, options, false);
        } else {
          clearToken(); // logout user
          return { ok: false, error: "Session expired", json: async () => ({} as T) };
        }
      }
      
      const data = await res.json().catch(() => null);
      return {
        ok: res.ok,
        error: res.ok ? undefined : data?.msg || "Request failed",
        json: async () => data as T,
      };
    } catch (err: any) {
      return { ok: false, error: err.message || "Network error", json: async () => ({} as T) };
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;

      const res = await fetch(`${baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.accessToken) {
        await setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return { request };
}
