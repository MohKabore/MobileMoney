import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  // user: User;
  verifyModel: any = {};
  notConfirmed: boolean;
  showValidationForm: boolean;
  isVisible: boolean;
  passwordForm: FormGroup;
  signinForm: FormGroup;
  constructor( private fb: FormBuilder, private router: Router, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.notConfirmed = false;
    this.authService.login(this.signinForm.value).subscribe((response) => {
      this.alertify.success('vous êtes connecté...');
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/home']);
    });
  }

}
