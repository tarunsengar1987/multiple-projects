import {Component, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {ChangeDetectorRef} from '@angular/core';
import {environment} from "../../environments/environment";
import {CredentialResponse} from "google-one-tap";
import {AuthService} from "../auth.service";
import {async, BehaviorSubject, Observable} from "rxjs";

declare const google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  
  customerId? : string;
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);

  private clientId = environment.clientId;

  has_error: boolean = false;
  message: string = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  initializeGoogleSignIn(): void {
    try {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: true,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        context: "signup"
      });
      const parent = document.getElementById('buttonGoogle');
      google.accounts.id.renderButton(parent, {theme:"outline",text:"signup_with",logo_alignment:"center"
      });
    } catch (error) {
      console.error('Error initializing Google library:', error);
      this.has_error = true;
    }
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.authService.addGoogleAccount(response.credential)
      .subscribe(() => {
        this.message = 'Success! You can now login to your account.';
        console.log('New user:');
        this.changeDetectorRef.detectChanges();
        this.hideLoginForm();
      }, (error) => {
        console.error('Error occurred when adding new user:', error);
        this.message = 'Error occurred when adding new user.';
        this.has_error = true;
        this.changeDetectorRef.detectChanges();
      });
  }

  hideLoginForm() {
    // @ts-ignore
    //document.getElementById("buttonGoogle").style.display = 'none';
    // @ts-ignore
    document.getElementById("loginform").style.display = 'none';
  }

  validateForm() {
    if (
      !this.email.value ||
      !this.password.value ||
      !this.username.value ||
      !this.confirmPassword.value
    ) {
      this.message = 'Please fill out all required data!';
      this.has_error = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
    if (this.password.value !== this.confirmPassword.value) {
      this.message = 'Your inputs are mismatched!';
      this.has_error = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.message = '';
    this.has_error = false;
    this.changeDetectorRef.detectChanges();
  }

  onSubmit() {
    this.validateForm();
    if (!this.has_error) {
      const usernameValue = this.username.value!;
      const passwordValue = this.password.value!;
      const emailValue = this.email.value!;

      if(this.customerId != undefined)
        this.authService.addUser({username: usernameValue, email: emailValue, password: passwordValue, customer: {id: Number(this.customerId), customername:""}}).subscribe(
          () => {
            this.message = 'Success! You can now login to your account.';
            console.log('New user:');
            this.changeDetectorRef.detectChanges();
            this.hideLoginForm();
          },
          (error) => {
            console.error('Error occurred when adding new user:', error);
            this.message = 'Error occurred when adding new user.';
            this.has_error = true;
            this.changeDetectorRef.detectChanges();
          }
        );
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = params["customerId"];
    });
    //this.initializeGoogleSignIn();
  }
}
