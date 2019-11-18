import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../_services/transction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  transactionForm: FormGroup;
  transaction;
  transactionTypes: any[] = [];
  constructor(private transactionService: TransactionService,  private fb: FormBuilder) { }

  ngOnInit() {
    this.transactionTypes = this.transactionService.transationTypes;
    this.createTransactioForm();
  }
  createTransactioForm() {
    this.transactionForm = this.fb.group({
      transactionTypeId: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required]
    });
  }

  next() {
  }

}
