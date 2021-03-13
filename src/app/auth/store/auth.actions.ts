import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const LOGIN_START = 'LOGIN_START';
export const LOGOUT = 'LOGOUT';
export const SIGNUP_START = 'SIGNUP_START';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;
    
    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date
    }) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    
    constructor(public payload: string) {}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    
    constructor(public payload: { email: string, password: string }) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    
    constructor(public payload: { email: string, password: string }) {}
}

export type AuthActions = AuthenticateSuccess
    | AuthenticateFail
    | AutoLogin
    | LoginStart
    | Logout
    | SignupStart;
