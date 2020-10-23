import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { DocFunctionsService } from '@app/services/doc.functions.service';
import { WUser } from '../model/data-types/w-user';
import { SerializationService } from './serialization.service';
import { QueryResponseLogin } from '../model/db-query/query-response-login';
import { QueryCommandLogin } from '../model/db-query/query-command-login';
import { QueryResponse } from '../model/db-query/query-response';
import { QueryCommandRegister } from '../model/db-query/query-command-register';
import { QueryResponseRegister } from '@app/webapi2/model/db-query/query-response-register';

@Injectable({
  providedIn: 'root'
})
export class AutorizationW2Service {
    private _loginExec = new Subject<QueryResponseLogin>();
    _loginExec$ = this._loginExec.asObservable();

    private _registerExec = new Subject<QueryResponseRegister>();
    _registerExec$ = this._registerExec.asObservable();

    onLogin(login: QueryResponseLogin) {
        this._loginExec.next(login);
    }

    onRegister(register: QueryResponseRegister) {
        this._registerExec.next(register);
    }

    constructor(
        private cookieService: CookieService,
        private dfs: DocFunctionsService,
        private serializationService: SerializationService
    ) {
    }

    getLogin(): WUser {
        let login = this.cookieService.get('login');

        let user = new WUser();
        if (this.dfs.notNull(login)) {
            user.fromJson(login);  
        }
        return user;
    }

    connect(login: string) {
        let command: QueryCommandLogin = new QueryCommandLogin(login);
        this.serializationService.connect(command).subscribe(r => this.onLogin( r ));
    }

    register(user: WUser) {
        let command: QueryCommandRegister = new QueryCommandRegister(user.login_, user.access_hash_);
        this.serializationService.register(command).subscribe(r => this.onRegister( r ));
    }
}
