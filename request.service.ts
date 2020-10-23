import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { QueryHeader } from '@app/webapi2/model/db-query/query-header';
import { SerializationService } from './serialization.service';
import { QueryResponse } from '@app/webapi2/model/db-query/query-response';
import { QueryCommand } from '@app/webapi2/model/db-query/query-command';
import { QueryResponseStatusTrue } from '@app/webapi2/model/db-query/query-response-status-true';
import { QueryCommandResponse } from '@app/webapi2/model/db-query/query-command-response';
import { RequestQueueItem } from '../model/db-query/request-queue-item';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private _requestsQueue: Array<RequestQueueItem> = [];

    private _isStarted: boolean = false;

    private _responseLoaded = new Subject<Array<QueryCommandResponse>>();
    _responseLoaded$ = this._responseLoaded.asObservable();

    constructor(private serialization: SerializationService) {
    }

    async start() {
        this._isStarted = true;
        await this._run();
    }

    async pushRequests(requests: Array<QueryCommand>) {
        if (!this._isStarted) {
            await this.start();
        }            
        if (requests) {
            let id = this.getStartQueryId();

            for (let request of requests) {
                request.id_query_ = id++;
                this._requestsQueue.push(new  RequestQueueItem(request));
            }
        }
        await this._run();
        return;
    }

    // private methods
    private getStartQueryId() : number {
        if ( !this._requestsQueue || this._requestsQueue.length == 0 ) {
            return 1;
        }

        let id = 0;
        for ( let item of this._requestsQueue ) {
            if ( item.request.id_query_ > id ) {
                id = item.request.id_query_; 
            }
        }
        return id + 1;
    }

    private async _run() {
        this._postRequest();
        return false;
    }

    private _postRequest() {
        if (this._requestsQueue.length > 0) {
            let commands: Array<QueryCommand> = [];
            for (let item of this._requestsQueue) {
                if ( item.sent == false ) {
                    item.sent = true;
                    commands.push(item.request.clone());
                }                
            }

            let request: QueryHeader = new QueryHeader(true, '', commands);
            this.serialization.post(request).subscribe(r => this._readResponse(r));
        }
    }

    private _readResponse(response: any) {
        if ( response && response.status == true) {
            if ( response.data ) {
                let responses: Array<QueryCommandResponse> = [];

                for ( let item of response.data ) {
                    let resp = this._makeResponse( item );
                    if ( resp ) {
                        responses.push(resp);
                        this._removeRequest(resp.id_query_);
                    }                    
                }           
                this._pushResponses(responses);
                return;
            }
            else {

            }                
        }
        else {

        }
    }

    private _makeResponse( source : any ) : QueryCommandResponse {
        let response : QueryCommandResponse = null;

        let request = this._getRequest( source.id_query);
        return request ? request.makeResponse(source) : null;
    }

    private _getRequest( id : number ) : QueryCommand {
        let request = this._requestsQueue.filter(item => item.request.id_query_ == id);
        return ( request && request.length > 0 ) ? request[0].request : null; 
    }

    private _removeRequest(id_query: number) {
        this._requestsQueue = this._requestsQueue.filter(item => item.request.id_query_ != id_query);
    }

    private _pushResponses(responses: Array<QueryCommandResponse>) {
        this._responseLoaded.next(responses);
    }

}