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
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import('./components/character-detail-page/character-detail-page.component').then(
        (m) => m.CharacterDetailPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'characters',
  },
];
