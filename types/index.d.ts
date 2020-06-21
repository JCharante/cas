export type Email = string;

export type SessionKey = string;

export interface RedesignedUser {
    email: Email;
    isAdmin: boolean;
}

export interface UserWithSessionKey extends RedesignedUser {
    sessionKey: SessionKey;
}

export interface AuthLoginResponse {
    message: string;
    data: UserWithSessionKey;
}

export interface AuthSignupResponse extends AuthLoginResponse {}
