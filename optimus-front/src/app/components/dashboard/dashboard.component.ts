import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  listaUsuarios: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        // Según tu UserController, la lista viene en la propiedad 'usuarios'
        this.listaUsuarios = res.usuarios;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }
}