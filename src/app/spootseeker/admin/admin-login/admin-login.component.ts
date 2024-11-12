import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthAdminService } from '../../service/auth-admin.service';
export class Login {
  public username!: string;
  public password!: string;

}

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  
  loginForm!: FormGroup;
  email: string = '';
  pass: string = '';
  constructor(private fb: FormBuilder, private auth_admin: AuthAdminService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.auth_admin.login(username, password);
    } else {
      alert('Please fill in all required fields.');
    }
  }
      

}
