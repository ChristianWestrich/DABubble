import { Component, inject } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from '../resetpassword/resetpassword.component';
import { Router, RouterLink } from '@angular/router';
import { AnimationService } from '../services/animation.service';
import { ChooseavatarComponent } from '../chooseavatar/chooseavatar.component';
import { SendemailComponent } from '../sendemail/sendemail.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SigninComponent, LoginComponent, SendemailComponent, RouterLink, ChooseavatarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isSignIsShowen = false
  isResetPwIsShowen = false
  isLoginShowen = true
  animationService = inject(AnimationService);
  animationPlayed = this.animationService.amountPlayed();
  chooseAvatar = false

  constructor() {
    this.animationPlayed = this.animationService.amountPlayed();
    console.log(this.animationPlayed);
  }

  showPwComponent(event: boolean) {
    this.isResetPwIsShowen = true
    this.isLoginShowen = false
    this.isSignIsShowen = false
    }

  showSignInComponent(event: boolean) {
    this.isSignIsShowen = false
    this.isLoginShowen = true
    }

    goToSignIn() {
      this.isLoginShowen = false
      this.isSignIsShowen = true
    }

    ngOnInit(): void {
      if (this.animationPlayed === 0) {
        setTimeout(() => {
          this.animationService.amountPlayed.set(1);
          this.animationPlayed = this.animationService.amountPlayed();
        }, 2000);
      }
    }

    showMain(event: boolean) {
      this.isLoginShowen = true;
      this.isResetPwIsShowen = false;
      this.isSignIsShowen = false;
      this.chooseAvatar = false;
    }

    showAvatar(event: boolean) {
      this.chooseAvatar = true
      this.isLoginShowen = false
      this.isResetPwIsShowen = false
      this.isSignIsShowen = false
    }

}
