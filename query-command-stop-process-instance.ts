import { QueryCommand } from "./query-command";
import { UUID } from "angular2-uuid";
import { QueryCommandResponse } from "./query-command-response";
import { QueryResponseStopProcessInstance } from "./query-response-stop-process-instance";

export class QueryCommandStopProcessInstance extends QueryCommand {
    private instance : UUID;

    constructor( id_query?: number, instance?: UUID ) {
        super( id_query, 'stopProcessInstance');

        this.instance_ = instance || '';
    }

    // properties getters and setters
    get instance_() : UUID {
        return this.instance_;
    }
    set instance_( value: UUID ) {
        this.instance = value;
    }

    // oveddides
    toJson(): string {
        return JSON.stringify(this);
    }

    makeResponse(source: any) : QueryCommandResponse {
        return new QueryResponseStopProcessInstance( source.id_query, source.status);
    }

    clone(): QueryCommandStopProcessInstance {
        return new QueryCommandStopProcessInstance(this.id_query_, this.instance_);
    }
}