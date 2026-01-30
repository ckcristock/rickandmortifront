import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(
        (m) => m.CharacterListComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
