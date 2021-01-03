export class User {
    
    constructor(public email: string,
                public userId: string,
                private _token: string,
                public expirationDate: Date) {
    }
    
    get token(): string {
        if (!this.expirationDate || new Date().getTime() > this.expirationDate.getTime()) {
            return null;
        } else {
            return this._token;
        }
    }
    
}
