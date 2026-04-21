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
          // 1. GUARDADO DE DATOS (Vital para el Dashboard Maestro)
          localStorage.setItem('token', res.token);
          localStorage.setItem('userName', res.user.nombre);
          localStorage.setItem('userSectorNombre', res.user.nombreSector);
          
          // Guardamos el ID del sector como string (el Dashboard hará el parseInt)
          // Si tu API devuelve 'idSector', asegúrate que el nombre coincida:
          const idSector = res.user.idSector || res.user.ID_Sector;
          localStorage.setItem('userSector', idSector.toString());

          // 2. DEBUG en consola
          console.log('✅ Login Exitoso. Redirigiendo al Dashboard...');
          console.log('Datos del usuario:', res.user);

          /**
           * 3. REDIRECCIÓN UNIFICADA
           * Ya no navegamos a sub-rutas porque tu Dashboard usa [ngSwitch].
           * Al ir a /dashboard, el componente leerá el ID que guardamos arriba
           * y mostrará el sector correspondiente automáticamente.
           */
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('❌ Error en el login:', err);
          // Mostramos el mensaje de error del backend o uno genérico
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error de servidor';
        }
      });
    }
  }
}