import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full',
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(
        (m) => m.CharacterListComponent,
      ),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./components/character-detail/character-detail.component').then(
            (m) => m.CharacterDetailComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'characters',
  },
];
