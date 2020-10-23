import { QueryCommandResponse } from "./query-command-response";

export abstract class QueryCommand {
    private id_query: number;
    private action: string;

    constructor(id_query?: number, action?: string) {
        this.id_query_ = id_query || 0;
        this.action_ = action || '';
    }

    // properties getters and setters
    get id_query_(): number {
        return this.id_query;
    }
    set id_query_(value: number) {
        this.id_query = value;
    }

    get action_(): string {
        return this.action;
    }
    set action_(value: string) {
        this.action = value;
    }

    // methods
    abstract toJson(): string;

    abstract makeResponse(source: any): QueryCommandResponse;

    abstract clone(): QueryCommand;
}
