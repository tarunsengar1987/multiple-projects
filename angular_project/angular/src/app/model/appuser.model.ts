import { Customer } from "./customer.model";

export class AppUser{
    id: number;
    username: string;
    email:string;
    //password: string, //TODO IMPORTANT! CHANGE THIS FAST!
    enabled: boolean;
    googleToken: string;
    customer: Customer;

    constructor(id: number, username: string,email: string, enabled: boolean, googleToken: string, customer: Customer){
        this.id = id;
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.googleToken = googleToken;
        this.customer = customer;
    }

    text(args: string[]){
        console.log("AppUser!", this, args);
    }
}