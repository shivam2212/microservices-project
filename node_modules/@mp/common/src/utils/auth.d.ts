export interface TokenPayload {
    id: string;
    role: string;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
