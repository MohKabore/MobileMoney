import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {

  @Output() createUser = new EventEmitter();
  user: any = {};
  roles: any[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

  saveAdding() {
    this.user.roles = this.roles;
    this.createUser.emit(this.user);
    this.bsModalRef.hide();
  }
}
