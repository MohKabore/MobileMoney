import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../_services/transction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from '../_services/alertify.service';
import { transition } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  transactionForm: FormGroup;
  transaction;
  transactionTypes: any[] = [];
  types: any[] = [];
  operators: any[] = [];
  ops: any[] = [];
  showDetails = false;
  constructor(private transactionService: TransactionService, private authService: AuthService, private fb: FormBuilder, private alertify: AlertifyService) { }

  ngOnInit() {
    this.transactionTypes = this.transactionService.transationTypes;
    this.createTransactioForm();
    this.getOperators();
  }
  createTransactioForm() {
    this.transactionForm = this.fb.group({
      transactionTypeId: ['', Validators.required],
      operatorId: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required]
    });
  }

  next() {
    this.transaction = this.transactionForm.value;
    let letype;
    if (this.transaction.transactionTypeId === environment.depot) {
      this.transaction.commission = this.transactionService.depositCommission(this.transaction.amount);
      letype = 'dépot';
    } else {
      this.transaction.commission = this.transactionService.withdrawalCommission(this.transaction.amount);
      letype = 'retrait';
    }
    const op = this.ops.find(o => o.id === Number(this.transactionForm.value.operatorId));
    console.log(op);
    this.transaction.detail = letype + ' ' + op.name;

    this.showDetails = true;
  }

  getOperators() {
    this.transactionService.getOperators().subscribe((response: any[]) => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < response.length; i++) {
        const element = { value: response[i].id, label: response[i].name };
        this.operators = [...this.operators, element];
      }
      this.ops = response;
    }
    );
  }


  saveTransaction() {

    this.transaction.userId = this.authService.decodedToken.nameid;
    this.transactionService.createTrasaction(this.transaction).subscribe(response => {
      this.alertify.success('enregistrement terminé...');
      this.transactionForm.reset();
      this.showDetails = false;
    }, error => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.showDetails = false;
  }
}
