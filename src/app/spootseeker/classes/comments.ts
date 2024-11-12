export class Comments {
    constructor(
        public id_comment: string,
        public id_destination: string,
        public id_event: string,

        public email_adhrent:string,
        public rates:number,
        public title_comment:string,
        public content:string,
    ){}
}
