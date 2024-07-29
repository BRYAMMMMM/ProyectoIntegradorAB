import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role-guard.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./Menu/inicio/inicio.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_ADMIN', 'ROLE_USER'] }
      },
      {
        path: 'perfil',
        loadComponent: () => import('./Menu/perfil/perfil.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_ADMIN'] }
      },
      {
        path: 'tabla',
        loadComponent: () => import('./Menu/tabla/tabla.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_USER', 'ROLE_ADMIN'] }
      },
      {
        path: 'prestamos',
        loadComponent: () => import('./Menu/prestamos/prestamos.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_USER', 'ROLE_ADMIN'] }
      },

      {
        path: 'prestamos',
        loadComponent: () => import('./Menu/prestamos/prestamos.component')
      },
      

      {
        path: 'historial',
        loadComponent: () => import('./Menu/historial/historial.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_ADMIN'] }
      }, 
      
      {
        path: 'devoluciones',
        loadComponent: () => import('./Menu/devoluciones/devoluciones.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_USER', 'ROLE_ADMIN'] }
      },
       
      {
        path: 'reservas',
        loadComponent: () => import('./Menu/reservas/reservas.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_USER', 'ROLE_ADMIN'] }
      },
      {
        path: 'devoReserva',
        loadComponent: () => import('./Menu/devoReserva/devolucionr/devolucion-r.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_USER', 'ROLE_ADMIN'] }
      }
      
    ]
  }
];