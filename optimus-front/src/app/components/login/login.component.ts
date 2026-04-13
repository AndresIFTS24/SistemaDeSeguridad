import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- NECESARIO PARA *ngIf
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <--- NECESARIO PARA formGroup
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <--- ESTOS DOS SON CLAVE
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]], // Antes era Email
  password: ['', [Validators.required]]                // Antes era PasswordHash
});
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.errorMessage = 'Credenciales incorrectas';
        }
      });
    }
  }
}