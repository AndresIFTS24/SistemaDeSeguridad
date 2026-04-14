import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          // --- GUARDADO DE DATOS EN LOCALSTORAGE ---
          // Guardamos el token para las futuras peticiones a la API
          localStorage.setItem('token', res.token);
          
          // Guardamos los datos del usuario para el Dashboard camaleón
          localStorage.setItem('userId', res.user.id.toString());
          localStorage.setItem('userName', res.user.nombre);
          localStorage.setItem('userEmail', res.user.email);
          localStorage.setItem('userSector', res.user.idSector.toString());
          localStorage.setItem('userSectorNombre', res.user.nombreSector);
          localStorage.setItem('userRol', res.user.idRol.toString());

          // Redirección al Dashboard Maestro
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error en el login:', err);
          // Si el backend envía un mensaje específico, lo usamos; si no, el genérico.
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error de conexión';
        }
      });
    }
  }
}