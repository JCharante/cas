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

export enum ErrorTypes {
    InvalidSessionKey,
    UserIsMissing
}

export interface CasError {
    type: ErrorTypes;
    debugMessage: string;
    displayableMessage: string;
}

export interface AuthAccountInfoResponse {
    data?: {
        email: string;
        userId: string;
        isAdmin: boolean;
    }

    hasError: boolean;

    error?: CasError;
}

export function isCasError(object: any): object is CasError {
    return 'displayableMessage' in object;
}

export function returnTrue(): boolean {
    return true;
}
