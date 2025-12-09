import { createContextKey, type Interceptor } from "@connectrpc/connect";

export const sessionTokenKey = createContextKey<string | undefined>(undefined);

export const authInterceptor: Interceptor = (next) => async (req) => {
    const token = req.contextValues.get(sessionTokenKey);
    if (token) {
        req.header.set("Authorization", `Bearer ${token}`);
    }
    return next(req);
};
