import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Subject, Subscription } from 'rxjs';

import { WUser } from '../model/data-types/w-user';
import { QueryCommand } from '../model/db-query/query-command';
import { QueryCommandSearchUsers } from '../model/db-query/query-command-search-users';
import { QueryResponse } from '../model/db-query/query-response';
import { QueryResponsePackage } from '../model/db-query/query-response-package';
import { QueryResponseSearchUsers } from '../model/db-query/query-response-search-users';
import { QueryCommandGetUsers } from '../model/db-query/query-command-get-users';
import { QueryResponseGetUsers } from '../model/db-query/query-response-get-users';
import { QueryCommandGetContacts } from '../model/db-query/query-command-get-contacts';
import { QueryResponseGetContacts } from '../model/db-query/query-response-get-contacts';
import { QueryCommandSetContacts } from '../model/db-query/query-command-set-contacts';
import { QueryCommandAddContact } from '../model/db-query/query-command-add-contact';
import { QueryCommandRemoveContact } from '../model/db-query/query-command-remove-contact';
import { WUsersGroup } from '../model/data-types/w-users-group';
import { QueryCommandEnumUsersGroups } from '../model/db-query/query-command-enum-users-groups';
import { QueryResponseEnumUsersGroups } from '../model/db-query/query-response-enum-users-groups';
import { QueryResponseGetUsersGroup } from '../model/db-query/query-response-get-users-group';
import { QueryCommandGetUsersGroup } from '../model/db-query/query-command-get-users-group';
import { QueryCommandSetUsersGroup } from '../model/db-query/query-command-set-users-group';
import { QueryResponseSetUsersGroup } from '../model/db-query/query-response-set-users-group';
import { QueryCommandDeleteUsersGroup } from '../model/db-query/query-command-delete-users-group';
import { WGroupSet } from '../model/data-types/w-group-set';
import { QueryCommandEnumGroupSets } from '../model/db-query/query-command-enum-group-sets';
import { QueryResponseEnumGroupSets } from '../model/db-query/query-response-enum-group-sets';
import { QueryCommandGetGroupSet } from '../model/db-query/query-command-get-group-set';
import { QueryResponseGetGroupSet } from '../model/db-query/query-response-get-group-set';
import { QueryCommandSetGroupSet } from '../model/db-query/query-command-set-group-set';
import { QueryResponseSetGroupSet } from '../model/db-query/query-response-set-group-set';
import { QueryCommandDeleteGroupSet } from '../model/db-query/query-command-delete-group-set';
import { WContacts } from '../model/data-types/w-contacts';
import { RequestService } from './request.service';
import { QueryCommandResponse } from '../model/db-query/query-command-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private _requests: Array<QueryCommand> = [];

    private _contactsLoaded = new Subject<Array<WContacts>>();
    _contactsLoaded$ = this._contactsLoaded.asObservable();

    private _contactsUpdated = new Subject<boolean>();
    _contactsUpdated$ = this._contactsUpdated.asObservable();

    private _contactsRemoved = new Subject<boolean>();
    _contactsRemoved$ = this._contactsRemoved.asObservable();

    private _usersLoaded = new Subject<Array<WUser>>();
    _usersLoaded$ = this._usersLoaded.asObservable();

    private _searchResult = new Subject<Array<WUser>>();
    _searchResult$ = this._searchResult.asObservable();

    private _groupsLoaded = new Subject<Array<WUsersGroup>>();
    _groupsLoaded$ = this._groupsLoaded.asObservable();

    private _groupLoaded = new Subject<WUsersGroup>();
    _groupLoaded$ = this._groupLoaded.asObservable();

    private _groupUpdated = new Subject<UUID>();
    _groupUpdated$ = this._groupUpdated.asObservable();

    private _groupRemoved = new Subject<boolean>();
    _groupRemoved$ = this._groupRemoved.asObservable();

    private _setsLoaded = new Subject<Array<WGroupSet>>();
    _setsLoaded$ = this._setsLoaded.asObservable();

    private _setLoaded = new Subject<WGroupSet>();
    _setLoaded$ = this._setLoaded.asObservable();

    private _setUpdated = new Subject<UUID>();
    _setUpdated$ = this._setUpdated.asObservable();

    private _setRemoved = new Subject<boolean>();
    _setRemoved$ = this._setRemoved.asObservable();

    private _requestSubscription: Subscription;

    constructor(private requestService: RequestService, ) {
        this._requestSubscription = this.requestService._responseLoaded$.subscribe(responses => this._onResponses(responses));
    }

    // requests 
    searchUsers(match?: string) {
        this._pushRequest( new QueryCommandSearchUsers(0, match));
    }

    getUsers(users: Array<UUID>) {
        this._pushRequest( new QueryCommandGetUsers(0, users)); 
    }

    getContacts() {
        this._pushRequest( new QueryCommandGetContacts(0));
    }

    setContacts(contacts: Array<UUID>) {
        this._pushRequest( new QueryCommandSetContacts(0, contacts));
    }

    addContact(contact: UUID) {
        this._pushRequest( new QueryCommandAddContact(0, contact));
    }

    removeContact(user: UUID) {
        this._pushRequest( new QueryCommandRemoveContact(0, user));
    }

    enumUsersGroups() {
        this._pushRequest( new QueryCommandEnumUsersGroups(0));
    }

    getUsersGroup(group: UUID) {
        this._pushRequest(new QueryCommandGetUsersGroup(0, group));
    }

    setUsersGroup(group: WUsersGroup) {
        this._pushRequest( new QueryCommandSetUsersGroup(0, group));
    }

    deleteUsersGroup(group: UUID) {
        this._pushRequest( new QueryCommandDeleteUsersGroup(0, group));
    }

    enumGroupSets() {
        this._pushRequest(new QueryCommandEnumGroupSets(0));
    }

    getGroupSet(set: UUID) {
        this._pushRequest(new QueryCommandGetGroupSet(0, set));
    }

    setGroupSet(set: WGroupSet) {
        this._pushRequest(new QueryCommandSetGroupSet(0, set));
    }

    deleteGroupSet(set: UUID) {
        this._pushRequest(new QueryCommandDeleteGroupSet(0, set));
    }

    // subscriptions events
    private _onResponses(responses: Array<QueryCommandResponse>) {
        for (let response of responses) {
            for (let request of this._requests) {
                if (request.id_query_ == response.id_query_) {
                    this._removeRequest(request.id_query_);                    
                    this._processingResponse(response, request.action_);
                }
            }
        }
    }

    // private methods
    private _pushRequest(command: QueryCommand) {
        let commands: Array<QueryCommand> = [];
        commands.push(command);

        this._requests.push(command);

        this.requestService.pushRequests(commands);
        return;
    }

    private _processingResponse(response: QueryCommandResponse, action: string ) {
        switch (action) {
            case 'searchUsers':
                {
                    let resp = response as QueryResponseSearchUsers;
                    if (resp.status_ == true) {
                        this._searchResult.next(resp.users_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'getUsers':
                {
                    let resp = response as QueryResponseGetUsers;
                    if (resp.status_ == true) {
                        this._usersLoaded.next(resp.users_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'getContacts':
                {
                    let resp = response as QueryResponseGetContacts;
                    if (resp.status_ == true) {
                        this._contactsLoaded.next(resp.contacts_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'setContacts':
                {
                    if (response.status_ == true) {
                        this._contactsUpdated.next(true);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'addContact':
                {
                    if (response.status_ == true) {
                        this._contactsUpdated.next(true);
                    }
                    else {
                        // error message
                    }

                }
                break;

            case 'removeContact':
                {
                    if (response.status_ == true) {
                        this._contactsRemoved.next(true);
                    }
                    else {
                        // error message
                    }
                }
                break;


            case 'enumUsersGroups':
                {
                    let resp = response as QueryResponseEnumUsersGroups;
                    if (response.status_ == true) {
                        this._groupsLoaded.next(resp.groups_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'getUsersGroup':
                {
                    let resp = response as QueryResponseGetUsersGroup;
                    if (response.status_ == true) {
                        this._groupLoaded.next(resp.group_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'setUsersGroup':
                {
                    let resp = response as QueryResponseSetUsersGroup;
                    if (resp.status_ == true) {
                        this._groupUpdated.next(resp.group_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'deleteUsersGroup':
                {
                    if (response.status_ == true) {
                        this._groupRemoved.next(true);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'enumGroupSets':
                {
                    let resp = response as QueryResponseEnumGroupSets;

                    if (resp.status_ == true) {
                        this._setsLoaded.next(resp.sets_);
                    }
                    else {
                        // error message
                    }
                }
                break;

            case 'getGroupSet':
                {
                    let resp = response as QueryResponseGetGroupSet;

                    if (resp.status_ == true) {
                        this._setLoaded.next(resp.set_);
                    }
                    else {
                        // error message
                    }
                }
                return;

            case 'setGroupSet':
                {
                    let resp = response as QueryResponseSetGroupSet;

                    if (resp.status_ == true) {
                        this._setUpdated.next(resp.set_);
                    }
                    else {
                        // error message
                    }
                }
                return;

            case 'deleteGroupSet':
                {
                    if (response.status_ == true) {
                        this._setRemoved.next(true);
                    }
                    else {
                        // error message
                    }
                }
                return;

        }        
    }

    private _removeRequest(id: number) {
        for (let index in this._requests) {
            if (this._requests[index].id_query_ == id) {
                this._requests.splice(Number(index), 1);
            }
        }
    } 
 }
