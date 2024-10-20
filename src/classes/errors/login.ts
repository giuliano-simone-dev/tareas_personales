export class LoginError extends Error {
    public code: string;
    constructor(msg: string) {
        super(msg);
        this.name = 'LoginError';
        this.code = 'error/login'
        this.stack = undefined;
    }
}

export class RegisterError extends Error {
    public code: string;
    constructor(msg: string) {
        super(msg);
        this.name = 'RegisterError';
        this.code = 'error/register'
        this.stack = undefined;
    }
}