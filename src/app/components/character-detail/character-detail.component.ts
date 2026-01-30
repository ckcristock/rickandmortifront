import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Character, Episode } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-detail',
  imports: [],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
})
export class CharacterDetailComponent {
  private readonly characterService = inject(CharacterService);

  character = input.required<Character>();
  close = output<void>();
  navigate = output<'prev' | 'next'>();

  protected readonly episodes = signal<Episode[]>([]);
  protected readonly loadingEpisodes = signal(false);

  constructor() {
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
    this.close.emit();
  }

  protected onNavigate(direction: 'prev' | 'next'): void {
    this.navigate.emit(direction);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
