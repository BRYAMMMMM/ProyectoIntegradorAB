import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role-guard.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./Menu/inicio/inicio.component')
      },
      {
        path: 'perfil',
        loadComponent: () => import('./Menu/perfil/perfil.component'),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['ROLE_ADMIN'] }
      },
      {
        path: 'tabla',
        loadComponent: () => import('./Menu/tabla/tabla.component')
      },
  

    ]
  }
];