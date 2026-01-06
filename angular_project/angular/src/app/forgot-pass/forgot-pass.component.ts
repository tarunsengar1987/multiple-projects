import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ForgotPassService} from "../forgot-pass.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit{
  email = new FormControl('', [Validators.required, Validators.email]);
  message: string = '';
  isError: boolean = false;
  emailSent: boolean = false;

  constructor(private userService: ForgotPassService, private router:Router) {
  }

  ngOnInit(): void {
  }

  forgotPassword(): void {
    if ((!this.email.valid) || (this.email.value == null)) {
      this.message = 'Please enter a valid email address';
      this.isError = true;
    }

    this.userService.forgotPassword(<string>this.email.value).subscribe(
      () => {
        this.message = 'Reset password email sent!';
        this.emailSent = true;
        this.isError = false;
      },
      () => {
        this.message = 'Error occurred while sending reset password email';
        this.isError = true;
      }
    );
  }
  goToHome(): void {
    this.router.navigateByUrl('/');
  }

  goToResetPassword(): void {
    this.router.navigateByUrl('/users/reset-password');
  }

}
