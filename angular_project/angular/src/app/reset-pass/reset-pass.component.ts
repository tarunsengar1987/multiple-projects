import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ForgotPassService} from "../forgot-pass.service";

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {
  token = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);
  message: string = '';
  isError: boolean = false;
  hideField: boolean = false;
  isSubmitted: boolean = false;

  constructor(private route: ActivatedRoute, private userService: ForgotPassService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const resetToken = params['token'];
      if (resetToken) {
        this.token.setValue(resetToken);
        this.hideField = true;
      }
    });
  }

  resetPassword(): void {
    const tokenValue = this.token.value;
    const passwordValue = this.password.value;
    const confirmPasswordValue = this.confirmPassword.value;

    if (!tokenValue) {
      this.message = 'Token is required';
      this.isError = true;
      return;
    }

    if (!passwordValue) {
      this.message = 'Password is required';
      this.isError = true;
      return;
    }
    if (passwordValue!==confirmPasswordValue){
      this.message = 'Your inputs are mismatched!';
      this.isError = true;
      return;
    }

    this.userService.resetPassword({token: tokenValue, password: passwordValue}).subscribe(
      () => {
        this.message = 'Password reset successfully!';
        this.isError = false;
        this.isSubmitted = true;
      },
      () => {
        this.message = 'Error occurred while resetting password';
        this.isError = true;
      }
    );
  }
  get isInputFrozen() {
    return this.isSubmitted;
  }


  goToHome() {
    this.router.navigateByUrl('/');
  }
}
