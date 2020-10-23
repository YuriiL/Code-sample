import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as CryptoJS from 'crypto-js';

import { LanguageService } from '@app/services/language.service';
import { AutorizationW2Service } from '@app/webapi2/services/autorization-w2.service';
import { RequestService } from '@app/webapi2/services/request.service';
import { SharedService } from '@app/services/shared.service';
import { QueryResponse } from '@app/webapi2/model/db-query/query-response';
import { QueryResponseRegister } from '@app/webapi2/model/db-query/query-response-register';
import { WUser } from '@app/webapi2/model/data-types/w-user';
import { DocFunctionsService } from '@app/services/doc.functions.service';

@Component({
  selector: 'register-w2',
  templateUrl: './register-w2.component.html',
  styleUrls: ['./register-w2.component.css']
})
export class RegisterW2Component implements OnInit {
    private _registerSubscription: Subscription;

    public user : any = {
        login: '',
        password: '',
        passwordConfirm: '',
        personal_mail: ''
    }

    message: boolean = false
    regError: boolean = false;

    constructor(
        public ls: LanguageService,
        private authorisationService : AutorizationW2Service,
        private requestService: RequestService, 
        private sharedService: SharedService,
        private router: Router,
        public dfs: DocFunctionsService
        ) {
          this._registerSubscription = this.authorisationService._registerExec$.subscribe(response => this._onRegister(response));
    }

    ngOnInit() {
    }

    public startRegistration() {
        let _user = new WUser();
        _user.login_ = this.user.login;
        _user.email_ = this.user.personal_mail;
        _user.access_hash_ = this._hash( this.user.login.toLowerCase() + this.user.password);

        this.authorisationService.register(_user);
    }

    // private methods
    private _onRegister( response: QueryResponseRegister) {
        if ( response ) {
            if ( this.dfs.notNull( response.status )) {
                if ( response.status == true) {
                    delete this.user.login;
                    delete this.user.password;
                    delete this.user.passwordConfirm;
                    delete this.user.personal_mail;

                    this.sharedService.token = response.token.toString();
                    this.requestService.start();

                    this.regError = false;
                    this.message = true;
                    setTimeout(function(){
                        this.router.navigate(['/dashboard']);
                    }, 2000);            
                }
                 else {
                    this.regError = true;
                 }
            }         
        }
    }

    private _hash(source: string): string {
        let crypto = require('crypto');
        let sha = crypto.createHash('sha1');
        sha.update( source);
        let result = sha.digest('base64');
      
        return result;
    }
      
}
