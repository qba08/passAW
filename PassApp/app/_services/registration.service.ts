import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Config } from '../_helpers/index'
import {User} from '../_models/index';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class RegistrationService {
    private loginUrl = Config.API_URL+'user';
    private headers = new Headers();
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
    }

    signUp(user: User): Observable<boolean> {
        let encrypt = CryptoJS.AES.encrypt(user.key, user.civilID).toString();
        let hash =  CryptoJS.SHA256(user.key).toString();
        return this.http.post(this.loginUrl, { login:user.username, email:user.email, password:user.password, phone:user.phone, key:encrypt, hash: hash}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                return success;

            });
    }
}