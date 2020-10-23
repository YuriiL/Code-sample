import { QueryCommand } from "./query-command";

export class QueryHeader {
    private async: boolean;
    private token: string;
    private data: Array<QueryCommand>;

    constructor(async?: boolean, token?: string, data?: Array<QueryCommand>) {
        this.async_ = async || false;
        this.token_ = token || '';
        this.data_ = data;
    }

    // properties getters and setters
    get async_(): boolean {
        return this.async;
    }
    set async_(value: boolean) {
        this.async = value;
    }

    get token_(): string {
        return this.token;
    }
    set token_(value: string) {
        this.token = value;
    }

    get data_(): Array<QueryCommand> {
        return this.data;
    }
    set data_(value: Array<QueryCommand>) {
        this.data = [];
        for (let command of value) {
            this.data.push(command.clone());
        }
    }

    // methods
    toJson(): string {
        return JSON.stringify(this);
    }

    fromJson(value: string) {
        let obj = JSON.parse(value);
        this.async_ = obj.async;
        this.token_ = obj.token;
        this.data_ = obj.data;
    }

    clone(): QueryHeader {
        return new QueryHeader(this.async_, this.token_, this.data_);
    }
}
