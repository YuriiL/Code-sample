
export class QueryCommandLogin {
    private async: boolean; 
    private action: string;    
    private hashlp: string;

    constructor( hashlp?: string) {
        this.async = false;
        this.action = 'login';
        this.hashlp = hashlp || '';
    }

    // properties getters and setters
    get hashlp_() : string {
        return this.hashlp;
    }
    set hashlp_( value: string ) {
        this.hashlp = value;
    }

    // methods
    toJson(): string {
        return JSON.stringify(this);
    }

    fromJson(value: string) {
        let obj = JSON.parse(value);
        this.async = obj.async;
        this.action = obj.action;
        this.hashlp = obj.hashlp;
    }

    clone(): QueryCommandLogin {
        return new QueryCommandLogin( this.hashlp );
    }
}
