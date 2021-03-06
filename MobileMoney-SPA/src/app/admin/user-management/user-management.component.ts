import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from '../../_services/admin.service';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      console.log(error);
    });
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
          this.alertify.success('modification terminée...');
        }, error => {
          console.log(error);
        });
      }
    });
  }
  adduser() {
    const initialState = {
      roles: this.getRolesList()
    };
    this.bsModalRef = this.modalService.show(AddUserModalComponent, { initialState });
    this.bsModalRef.content.createUser.subscribe((usertoCreate) => {
      const rolesToAdd = {
        roleNames: [...usertoCreate.roles.filter(el => el.checked === true).map(el => el.name)]
      };
      usertoCreate.roles = rolesToAdd.roleNames;
      this.adminService.CreateUserWithRoles(usertoCreate).subscribe((newUser: User) => {
        this.users = [...this.users, newUser];
        this.alertify.success('enregistrement  terminé...');

      }, error => {
        console.log(error);
      });
    });
  }


  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Operator', value: 'Operator' },
      { name: 'VIP', value: 'VIP' },
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }

  private getRolesList() {
    const roles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Operator', value: 'Operator' },
      { name: 'VIP', value: 'VIP' },
    ];
    return roles;
  }

}
