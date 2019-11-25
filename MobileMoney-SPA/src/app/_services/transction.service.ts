import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    baseUrl = environment.apiUrl + 'transaction/';
    transationTypes = [
        { value: 1, label: 'dépot' },
        { value: 2, label: 'retrait' }
    ];
    constructor(private http: HttpClient, private alertify: AlertifyService, private router: Router) { }
    depositCommission(amount: number) {
        if (amount > 200) {
            if (amount < 6001) {
                return 10;
            } else if (amount >= 6001 && amount < 26000) {
                return 50;
            } else if (amount >= 26001 && amount < 52001) {
                return 125;
            } else if (amount >= 52001 && amount < 105000) {
                return 250;
            } else if (amount >= 105001 && amount < 260000) {
                return 500;
            } else if (amount >= 260001 && amount < 520000) {
                return 1000;
            } else if (amount >= 520005 && amount < 1050000) {
                return 2000;
            } else if (amount >= 1050005 && amount <= 1500000) {
                return 3000;
            }
        } else {
            return 0;
        }
    }

    withdrawalCommission(amount: number) {
        if (amount > 200) {
            if (amount < 5000) {
                return 25;
            } else if (amount >= 5001 && amount < 25000) {
                return 125;
            } else if (amount >= 25001 && amount < 50001) {
                return 250;
            } else if (amount >= 50001 && amount < 100001) {
                return 500;
            } else if (amount >= 100001 && amount < 250001) {
                return 750;
            } else if (amount >= 250001 && amount < 500001) {
                return 1500;
            } else if (amount >= 500005 && amount < 1050005) {
                return 3000;
            } else if (amount >= 1050005 && amount <= 1500000) {
                return 4500;
            }
        } else {
            return 0;
        }
    }
    getOperators() {
        return this.http.get(this.baseUrl + 'GetOperators');
    }

    createTrasaction(transaction) {
        return this.http.post(this.baseUrl + 'CreateTransaction', transaction);
    }

    searchTransaction(dateInterVal) {

        return this.http.post(this.baseUrl + 'SearchTransactions', dateInterVal);
    }
}
