import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, Episode } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-detail-page',
  imports: [],
  templateUrl: './character-detail-page.component.html',
  styleUrl: './character-detail-page.component.scss',
  host: {
    '(document:keydown.arrowLeft)': 'onKeyLeft()',
    '(document:keydown.arrowRight)': 'onKeyRight()',
    '(document:keydown.escape)': 'onClose()',
  },
})
export class CharacterDetailPageComponent {
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly character = signal<Character | null>(null);
  protected readonly episodes = signal<Episode[]>([]);
  protected readonly loadingEpisodes = signal(false);
  protected readonly loading = signal(true);

  constructor() {
    effect(
      () => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.loadCharacter(parseInt(id));
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const char = this.character();
        if (char) {
          this.loadEpisodes();
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
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/characters']);
      },
    });
  }

  protected loadEpisodes(): void {
    const char = this.character();
    if (!char?.episode?.length) {
      this.episodes.set([]);
      return;
    }

    this.loadingEpisodes.set(true);
    const episodeIds = char.episode.map((url) => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1]);
    });

    this.characterService.getMultipleEpisodes(episodeIds).subscribe({
      next: (eps: Episode[] | Episode) => {
        this.episodes.set(Array.isArray(eps) ? eps : [eps]);
        this.loadingEpisodes.set(false);
      },
      error: () => {
        this.episodes.set([]);
        this.loadingEpisodes.set(false);
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
      this.loadCharacter(newId);
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
}
