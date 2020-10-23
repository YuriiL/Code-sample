import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from '@app/services/shared.service';
import { QueryHeader } from '../../webapi2/model/db-query/query-header';
import { QueryResponse } from '../../webapi2/model/db-query/query-response';
import { catchError } from 'rxjs/operators';
import { QueryCommandLogin } from '../model/db-query/query-command-login';
import { QueryResponseLogin } from '../model/db-query/query-response-login';
import { QueryCommandRegister } from '../model/db-query/query-command-register';
import { QueryCommandResponse } from '@app/webapi2/model/db-query/query-command-response';
import { QueryResponseRegister } from '@app/webapi2/model/db-query/query-response-register';


@Injectable({
  providedIn: 'root'
})
export class SerializationService {
    private _url;
    private _handleError;

    constructor(private http: HttpClient, errorHandler: HttpErrorHandlerService, private sharedService: SharedService) {
        //this._url = 'http://' + this.sharedService.servers[this.sharedService.numServer];
        this._url = "http://headnet.by:7110";


        this._handleError = errorHandler.createHandler('SerializationService');
    }

    connect(login: QueryCommandLogin): Observable<QueryResponseLogin> {
        let loginJson = login.toJson();

        let headers: HttpHeaders = new HttpHeaders();
        
        headers.set("Content-Type",  "text/plain");

        return this.http.post<QueryResponseLogin>(this._url, loginJson, {headers: headers} ).pipe(
            catchError( this._handleError(login.toString(), []))
        );
    }

    register( cmd: QueryCommandRegister ) : Observable<QueryResponseRegister> {
        let cmdJson = cmd.toJson();

        let headers: HttpHeaders = new HttpHeaders();
        headers.set("Content-Type",  "text/plain");
        headers.set("Content-Length",  ( cmdJson.length + 1 ).toString());

        return this.http.post<QueryResponseRegister>(this._url, cmdJson, {headers: headers} ).pipe(
            catchError( this._handleError(cmd.toString(), []))
        );
    }

    get(query: QueryHeader): Observable<QueryResponse> {
        query.token_ = this.sharedService.token;

        let queryJson = query.toJson();
        return this.http.post<QueryResponse>(this._url, queryJson).pipe(
            catchError(this._handleError(query.toString(), []))
        );
    }

   post(query: QueryHeader): Observable<QueryResponse> {
        query.token_ = this.sharedService.token;

        let queryJson = query.toJson();

        let headers: HttpHeaders = new HttpHeaders();        
        headers.set("Content-Type",  "text/plain");

        return this.http.post<QueryResponse>(this._url, queryJson , {headers: headers}).pipe(
            catchError(this._handleError(query.toString(), []))
        );
    }

    disconnect() {
    }
}
