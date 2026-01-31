import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Character, Episode } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-detail',
  imports: [],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
  host: {
    '(document:keydown.arrowLeft)': 'onKeyLeft()',
    '(document:keydown.arrowRight)': 'onKeyRight()',
    '(document:keydown.escape)': 'onClose()',
  },
})
export class CharacterDetailComponent {
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly characterId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
  );

  protected readonly character = signal<Character | null>(null);
  protected readonly episodes = signal<Episode[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    effect(
      () => {
        const id = this.characterId();
        if (id) {
          this.loadCharacter(parseInt(id));
        }
      },
      { allowSignalWrites: true },
    );
  }

  private loadCharacter(id: number): void {
    this.loading.set(true);
    this.characterService.getCharacterById(id).subscribe({
      next: (char: Character) => {
        this.character.set(char);
        // Los episodios ya vienen en el character desde el backend
        if (char.episodes) {
          this.episodes.set(char.episodes);
        } else {
          this.episodes.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/characters']);
      },
    });
  }

  protected onClose(): void {
    this.router.navigate(['/characters']);
  }

  protected onNavigate(direction: 'prev' | 'next'): void {
    const current = this.character();
    if (!current) return;

    const newId = direction === 'prev' ? current.id - 1 : current.id + 1;
    if (newId > 0) {
      this.router.navigate(['/characters', newId]);
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  protected onKeyLeft(): void {
    this.onNavigate('prev');
  }

  protected onKeyRight(): void {
    this.onNavigate('next');
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3MzczNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
    img.style.objectFit = 'contain';
  }
}
