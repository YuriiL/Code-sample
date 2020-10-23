import { QueryCommandResponse } from "./query-command-response";
import { UUID } from "angular2-uuid";

export class QueryResponseLogin {
    public status: boolean;
    public token: string;

    constructor(status?: boolean, token?: string) {
        this.status = status;
        this.token = token;
    }


    // overrides
    toJson(): string {
        return JSON.stringify(this);
    }

    fromJson(value: string): void {
        let obj = JSON.parse(value);
        this.status = obj.status;
        this.token = obj.token;
    }

    clone(): QueryResponseLogin {
        return new QueryResponseLogin( this.status, this.token);
    }
}
