import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueryResponse } from '../model/db-query/query-response';

@Injectable({
  providedIn: 'root'
})
export class QueryResponseService {
    private _response = new Subject<QueryResponse>();
    _response$ = this._response.asObservable();

    update(data: any) {
        this._response.next(data);
    }

    constructor() {
    }
}
