import { UUID } from "angular2-uuid";

export class WUser {
    private id: UUID;
    private login: string;
    private access_hash: string;
    private first_name: string;
    private last_name: string;
    private phone: string;
    private email: string;
    private inactive: boolean;

    constructor(
        id?: UUID,
        login?: string,
        access_hash?: string,
        first_name?: string,
        last_name?: string,
        phone?: string,
        email?: string,
        inactive?: boolean
    ) {
        this.id_ = id || '';
        this.login_ = login || '';
        this.access_hash_ = access_hash || '';
        this.first_name_ = first_name || '';
        this.last_name_ = last_name || '';
        this.phone_ = phone || '';
        this.email_ = email || '';
        this.inactive_ = inactive || false;

    }

    // properties getters and setters
    get id_(): UUID {
        return this.id;
    }
    set id_(value: UUID) {
        this.id = value;
    }

    get login_(): string {
        return this.login;
    }
    set login_(value: string) {
        this.login = value;
    }

    get access_hash_(): string {
        return this.access_hash;
    }
    set access_hash_(value: string) {
        this.access_hash = value;
    }

    get first_name_(): string {
        return this.first_name;
    }
    set first_name_(value: string) {
        this.first_name = value;
    }

    get last_name_(): string {
        return this.last_name;
    }
    set last_name_(value: string) {
        this.last_name = value;
    }

    get phone_(): string {
        return this.phone;
    }
    set phone_(value: string) {
        this.phone = value;
    }

    get email_(): string {
        return this.email;
    }
    set email_(value: string) {
        this.email = value;
    }

    get inactive_(): boolean {
        return this.inactive;
    }
    set inactive_(value: boolean) {
        this.inactive = value;
    }

    // methods
    clone(): WUser {
        return new WUser(this.id_, this.login_, this.access_hash_, this.first_name_, this.last_name_, this.phone, this.email, this.inactive_);
    }

    fromJson(source: string) {
        let obj = JSON.parse(source);
        this.id_ = obj.id;
        this.login_ = obj.login;
        this.access_hash_ = obj.access_hash;
        this.first_name_ = obj.first_name;
        this.last_name_ = obj.last_name;
        this.phone_ = obj.phone;
        this.email_ = obj.email;
        this.inactive_ = obj.inactive;
    }

    toJson(): string {
        return JSON.stringify(this);
    }
}
