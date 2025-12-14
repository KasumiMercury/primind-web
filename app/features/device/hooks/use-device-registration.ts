import { useEffect, useRef } from "react";
import { getFCMToken } from "../lib/fcm-client";

interface DeviceInfo {
    timezone: string;
    locale: string;
    platform: string;
    fcm_token?: string;
}

interface RegisterDeviceResponse {
    success?: boolean;
    device_id?: string;
    is_new?: boolean;
    error?: string;
}

async function registerDevice(
    deviceInfo: DeviceInfo,
): Promise<RegisterDeviceResponse> {
    const response = await fetch("/api/device", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceInfo),
    });

    return response.json();
}

export function useDeviceRegistration() {
    const hasRegistered = useRef(false);

    useEffect(() => {
        if (hasRegistered.current) {
            return;
        }

        async function register() {
            try {
                const fcmToken = await getFCMToken();

                const deviceInfo: DeviceInfo = {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language,
                    platform: "web",
                    fcm_token: fcmToken || undefined,
                };

                const result = await registerDevice(deviceInfo);

                if (result.success) {
                    hasRegistered.current = true;
                } else {
                    console.error("Device registration failed:", result.error);
                }
            } catch (err) {
                console.error("Device registration failed:", err);
            }
        }

        register();
    }, []);
}
