import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../_services/transction.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  dateInterval: any = {};
  transactions;
  showList = false;
  noResult = '';

  constructor(private transactionService: TransactionService, private alertify: AlertifyService) { }

  ngOnInit() {

  }

  searchTransaction() {
    this.transactions = [];
    this.showList = true;
    this.noResult = '';
    this.transactionService.searchTransaction(this.dateInterval).subscribe((response) => {
      if (response) {
        this.transactions = response;
      } else {
        this.noResult = 'aucune transcation trouvée...'
      }
    }, error => {
      this.alertify.error(error);
    });
  }

}
