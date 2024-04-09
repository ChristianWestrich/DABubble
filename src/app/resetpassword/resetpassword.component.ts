import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

// import custom components
import { OverlayanmeldenComponent } from './overlayanmelden/overlayanmelden.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ FormsModule,
  OverlayanmeldenComponent ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
  newPassword!:string;
  confirmPassword!:string;


  constructor(private router: Router, private route: ActivatedRoute) {}

  toggleOverlay:boolean = true;

  onSubmit(form:NgForm){
    if(form.valid){
      this.toggleOverlay = !this.toggleOverlay;
      form.reset();
    }

  }
}
