import { UUID } from "angular2-uuid";

export class WUsersGroup {
    private id: UUID;
    private parent: UUID;
    private isParent: boolean;
    private name: string;
    private caption: string;
    private users: Array<UUID>;

    constructor(
        id?: UUID,
        parent?: UUID,
        isParent?: boolean,
        name?: string,
        caption?: string,
        users?: Array<UUID>
    ) {
        this.id_ = id || '';
        this.parent_ = parent || '';
        this.isParent_ = isParent || false;
        this.name_ = name || '';
        this.caption_ = caption || '';
        this.users_ = users;

    }

    // properties getters and setters
    get id_(): UUID {
        return this.id;
    }
    set id_(value: UUID) {
        this.id = value;
    }

    get parent_(): UUID {
        return this.parent;
    }
    set parent_(value: UUID) {
        this.parent = value;
    }

    get isParent_(): boolean {
        return this.isParent;
    }
    set isParent_(value: boolean) {
        this.isParent = value;
    }

    get name_(): string {
        return this.name;
    }
    set name_(value: string) {
        this.name = value;
    }

    get caption_(): string {
        return this.caption;
    }
    set caption_(value: string) {
        this.caption = value;
    }

    get users_(): Array<UUID> {
        return this.users;
    }
    set users_(value: Array<UUID>) {
        this.users = [];
        if (value) {
            for (let user of value) {
                this.users.push(user);
            }
        }
    }

    // methods
    clone(): WUsersGroup {
        return new WUsersGroup(this.id_, this.parent_, this.isParent_, this.name_, this.caption_, this.users_);
    }
}
