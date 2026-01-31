import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Character, CharacterResponse } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-character-list',
  imports: [FormsModule, ToolbarComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent {
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);

  protected readonly characters = signal<Character[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly nameFilter = signal('');
  protected readonly statusFilter = signal('');
  protected readonly speciesFilter = signal('');

  protected readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1); // Ellipsis
      }

      pages.push(total);
    }

    return pages;
  });

  constructor() {
    effect(
      () => {
        this.loadCharacters();
      },
      { allowSignalWrites: true },
    );
  }

  protected loadCharacters(): void {
    this.loading.set(true);
    this.error.set(null);

    this.characterService
      .getCharacters(
        this.currentPage(),
        this.nameFilter() || undefined,
        this.statusFilter() || undefined,
        this.speciesFilter() || undefined,
      )
      .subscribe({
        next: (response: CharacterResponse) => {
          this.characters.set(response.results);
          this.totalPages.set(response.info.pages);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.characters.set([]);
          this.loading.set(false);
        },
      });
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.loadCharacters();
  }

  protected clearFilters(): void {
    this.nameFilter.set('');
    this.statusFilter.set('');
    this.speciesFilter.set('');
    this.currentPage.set(1);
    this.loadCharacters();
  }

  protected goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected openDetail(character: Character): void {
    this.router.navigate(['/characters', character.id]);
  }
}
