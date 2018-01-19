export class Data {
    id: string;
    name: string;
    url: string;
    login: string;
    password: string;

    constructor(id:string,
                name:string,
                url:string,
                login?:string,
                password?:string){
        this.id = id;
        this.name = name;
        this.url = url;
        this.login = login;
        this.password = password;
    }
}