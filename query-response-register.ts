import { QueryResponse } from './query-response';

export class QueryResponseRegister extends QueryResponse {
    public token: string;

    constructor( status?: boolean, token?: string) {
        super( status );
        this.token = token || '';
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

    clone(): QueryResponse {
        return new QueryResponseRegister( this.status, this.token);
    }

}
