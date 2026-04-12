import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importante para que funcionen los formularios
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
    // Definimos los campos que coinciden con tu JSON del backend
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      PasswordHash: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('¡Bienvenido a OPTIMUS!', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = 'Credenciales inválidas. Intente de nuevo.';
          console.error(err);
        }
      });
    }
  }
}