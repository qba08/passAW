import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../_helpers/index'
import { Data } from '../_models/index';
import { AuthenticationService } from '../_services/index';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class DataService {
    private apiUrl = Config.API_URL+'data';
    private headers = new Headers({'Authorization': this.authenticationService.token });
    private options = new RequestOptions({ headers: this.headers });
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getAll():Observable<Data[]>{
        return this.http.get(this.apiUrl, this.options)
            .map((response: Response)=> {
                let success = response.json() && response.json().success;
                if (success) {
                    return  <Data[]>response.json().data;
                } else {
                    return null;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    getKey(data: Data, key: string):Observable<Data>{
        return this.http.post(this.apiUrl+'/key',{id:data.id, hash:CryptoJS.SHA256(key).toString()}, this.options)
            .map((response: Response)=> {
                let success = response.json() && response.json().success;
                if (success) {
                    let resData = response.json().data;
                    let decrypt = CryptoJS.AES.decrypt(resData.password,key).toString(CryptoJS.enc.Utf8);
                    return new Data(data.id,data.name,data.url,resData.login,decrypt);
                } else {
                    return null;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    addData(data: Data, key: string): Observable<boolean> {
        let encrypt = CryptoJS.AES.encrypt(data.password, key).toString();
        return this.http.post(this.apiUrl, { name:data.name, url:data.url, login:data.login, password:encrypt}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if (success) {
                    // return true to indicate successful response
                    return true;
                } else {
                    // return false to indicate failed response
                    return false;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    editData(data: Data): Observable<boolean> {

        return this.http.put(this.apiUrl, { id:data.id, name:data.name, url:data.url}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if (success) {
                    // return true to indicate successful response
                    return true;
                } else {
                    // return false to indicate failed response
                    return false;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

    deleteData(data: Data): Observable<boolean> {

        return this.http.post(this.apiUrl+'/delete', { id:data.id}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if (success) {
                    // return true to indicate successful response
                    return true;
                } else {
                    // return false to indicate failed response
                    return false;
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }

}