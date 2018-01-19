import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Config } from '../_helpers/index'

@Injectable()
export class GeneratorService {
    private loginUrl = Config.API_URL+'generator';
    private headers = new Headers();
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
    }

    generate(len: number, alph: number): Observable<string> {
        return this.http.post(this.loginUrl, { keyLength:len, keyAlphabet:alph}, this.options)
            .map((response: Response) => {
                let success = response.json() && response.json().success;
                if (success) {
                    return response.json().data;
                } else {
                    // return false to indicate failed response
                    return null;
                }
            });
    }

    getRandNum(min: number, max: number): any {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    create(len: number, alphType: number): string{
        let lowerCase: string = 'abcdefghijklmnopqrstuwxyz';
        let upperCase: string = 'ABCDEFGHIJKLMNOPQRSTUWXYZ';
        let numbers: string = '1234567890';
        let specialCharacters: string = '{}[]<>()!@#$%^&*-=_+;:,.';

        let alphabet :any[] = [];
        let randLen:number = 0;
        let currentLen:number = len;

        let randString: string = '';

        switch(alphType){
            case 1:
                alphabet.push({alph:numbers, len:len});
                break;
            case 2:
                alphabet.push({alph:lowerCase, len:len});
                break;
            case 3:
                randLen = this.getRandNum(1,len-1);
                alphabet.push({alph:lowerCase, len:randLen });
                alphabet.push({alph:numbers, len:len-randLen});
                break;
            case 4:
                randLen = this.getRandNum(1,currentLen-2);
                alphabet.push({alph:lowerCase, len:randLen });
                currentLen = currentLen-randLen;
                randLen = this.getRandNum(1,currentLen-1);
                alphabet.push({alph:numbers, len:randLen});
                currentLen = currentLen-randLen;
                alphabet.push({alph:upperCase, len:currentLen});
                break;
            case 5:
                randLen = this.getRandNum(1,Math.floor((currentLen-3)/4)+1);
                alphabet.push({alph:specialCharacters, len:randLen});
                currentLen = currentLen-randLen;
                randLen = this.getRandNum(1,currentLen-2);
                alphabet.push({alph:numbers, len:randLen});
                currentLen = currentLen-randLen;
                randLen = this.getRandNum(1,currentLen-1);
                alphabet.push({alph:upperCase, len:randLen});
                currentLen = currentLen-randLen;
                alphabet.push({alph:lowerCase, len:currentLen});
                break;
        }

        let elem: any;
        let alph: string;
        let i: number;
        while(elem = alphabet.pop()){
            alph = elem.alph;
            currentLen = elem.len;
            for(i=0;i<currentLen;i++){
                randString= randString + alph.charAt(this.getRandNum(0,alph.length-1));
            }
        }

        let strArray:string[] = randString.split('');
        let char:string;
        let index:number;
        let swapIndex:number;
        for(index=0;index<strArray.length;index++){
            swapIndex=this.getRandNum(0,strArray.length-1);
            char=strArray[swapIndex];
            strArray[swapIndex] = strArray[index];
            strArray[index] = char;
        }

        return strArray.join('');
    }
}