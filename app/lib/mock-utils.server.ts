export function connectMockApi(): boolean {
    const useMock = import.meta.env.VITE_USE_MOCK_API;
    return useMock === "true" || useMock === true;
}

export function logTransportMode(
    serviceName: string,
    isMock: boolean,
    logger: { info: (obj: object, msg: string) => void },
): void {
    if (isMock) {
        logger.info(
            { service: serviceName, mode: "mock" },
            "Using MOCK transport (in-memory)",
        );
    } else {
        const baseUrl =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        logger.info(
            { service: serviceName, mode: "real", baseUrl },
            "Using REAL transport (HTTP)",
        );
    }
}
