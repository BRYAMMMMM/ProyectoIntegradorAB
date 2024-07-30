import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Prestamo } from '../../Prestamo.module';
import { PrestamoService } from '../../service/prestamo.service';
import { ReservaService } from '../../service/reserva.service';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export default class InicioComponent implements OnInit {
  isModalOpen = false;
  token: string | null = null;
  decodedToken: any = null;
  username: string = '';
  roles: string[] = [];
  pendingReturns: Prestamo[] = [];
  prestamos: Prestamo[] = [];
  reminders: string[] = [];

  prestamoReminders: string[] = [];
  reservaReminders: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private prestamoService: PrestamoService,

    private reservaService: ReservaService,
  ) {}

  modalBook = {
    title: '',
    author: '',
    price: '',
    genre: '',
    publisher: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        localStorage.setItem('token', this.token);
        this.authService.setSession(this.token);
        this.decodedToken = this.authService.decodeToken(this.token);
        this.username = this.decodedToken.username; // Obtén el nombre de usuario
        this.roles = this.decodedToken.roles; // Obtén los roles
        console.log(`Bienvenido ${this.username} - Rol: ${this.roles.join(', ')}`);
        
        // Obtener préstamos pendientes
        this.authService.getPendingReturns(this.username).subscribe({
          next: (data: Prestamo[]) => {
            this.pendingReturns = data;
          },
          error: (error) => {
            console.error('Error al obtener préstamos pendientes:', error);
          }
        });
      } else {
        console.log('No token found.');
      }
    });

    this.cargarRecordatorios();

  }

  

  openModal(title: string, author: string, price: number, genre: string, publisher: string) {
    this.modalBook = { title, author, price: `${price}`, genre, publisher };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  cargarPrestamosActivos(): void {
    this.prestamoService.obtenerPrestamosActivos().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        this.cargarRecordatorios();
      },
      error: (error) => {
        console.error('Error al cargar préstamos activos:', error);
      }
    });
  }

  cargarRecordatorios(): void {
    const username = this.authService.getUsername();

    // Cargar recordatorios de préstamos
    this.prestamoService.obtenerPrestamosActivos().subscribe({
      next: (data: any) => {
        const now = new Date();
        this.prestamoReminders = data
          .filter((prestamo: any) => prestamo.usuario.username === username && new Date(prestamo.fechaDevolucion) > now)
          .map((prestamo: any) => {
            const diasRestantes = Math.ceil((new Date(prestamo.fechaDevolucion).getTime() - now.getTime()) / (1000 * 3600 * 24));
            return `Recordatorio: El libro "${prestamo.libro.titulo}" debe ser devuelto en ${diasRestantes} días.`;
          });
      },
      error: (error) => {
        console.error('Error al cargar recordatorios de préstamos:', error);
      }
    });

    // Cargar recordatorios de reservas
    this.reservaService.obtenerReservasActivas().subscribe({
      next: (data: any) => {
        const now = new Date();
        this.reservaReminders = data
          .filter((reserva: any) => reserva.usuario.username === username && new Date(reserva.fechaReserva) > now)
          .map((reserva: any) => {
            const diasRestantes = Math.ceil((new Date(reserva.fechaReserva).getTime() - now.getTime()) / (1000 * 3600 * 24));
            return `Recordatorio: El libro "${reserva.libro.titulo}" tiene una reserva para dentro de ${diasRestantes} días.`;
          });
      },
      error: (error) => {
        console.error('Error al cargar recordatorios de reservas:', error);
      }
    });
  }
}