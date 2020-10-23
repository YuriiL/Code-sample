import { QueryCommand } from "./query-command";

export class QueryCommandRegister {
    private async: boolean;
    private action: string;
    private login: string;
    private hashlp: string;
    //private email: string;

    constructor( login?: string, hashlp?: string, email?: string) {
        this.async = false;
        this.action = 'register';
        this.login_ = login || '';
        this.hashlp_ = hashlp || '';
//        this.email_ = email || '';
    }

    // properties getters and setters
    get login_(): string {
        return this.login;
    }
    set login_(value: string) {
        this.login = value;
    }

    get hashlp_(): string {
        return this.hashlp;
    }
    set hashlp_(value: string) {
        this.hashlp = value;
    }

/*    get email_(): string {
        return this.email;
    }
    set email_(value: string) {
        this.email = value;
    }*/

    // overrides
    toJson(): string {
        return JSON.stringify(this);
    }

    fromJson(value: string) {
        let obj = JSON.parse(value);
        this.async = obj.async;
        this.action = obj.action;
        this.login_ = obj.login;
        this.hashlp_ = obj.hashlp;
//        this.email_ = obj.email;
    }

    clone(): QueryCommandRegister {
        return new QueryCommandRegister( this.login_, this.hashlp_);
    }
}
