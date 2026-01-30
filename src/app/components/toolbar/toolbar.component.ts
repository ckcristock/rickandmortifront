import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  protected readonly userName = signal('Rick Sanchez');
  protected readonly userAvatar = signal('https://rickandmortyapi.com/api/character/avatar/1.jpeg');
}
