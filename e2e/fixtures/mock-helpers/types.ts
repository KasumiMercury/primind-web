export type OmitProtoFields<T> = Omit<T, "$typeName" | "$unknown">;

export type TimestampJson = { seconds: string; nanos: number };
