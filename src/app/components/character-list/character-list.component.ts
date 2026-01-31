import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { Character, CharacterResponse } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-character-list',
  imports: [FormsModule, ToolbarComponent, RouterOutlet],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent {
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);
  private readonly searchSubject = new Subject<void>();

  protected readonly characters = signal<Character[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly nameFilter = signal('');
  protected readonly statusFilter = signal('');
  protected readonly speciesFilter = signal('');

  protected readonly hasActiveFilters = computed(
    () => this.nameFilter() !== '' || this.statusFilter() !== '' || this.speciesFilter() !== '',
  );

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
    // Effect solo para cambios de página (no filtros)
    effect(
      () => {
        const page = this.currentPage();
        // Solo ejecutar si la página cambió, no por otros cambios
        this.loadCharacters();
      },
      { allowSignalWrites: true },
    );

    // Debounce para búsquedas con filtros
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(() => {
          this.loading.set(true);
          this.error.set(null);
          
          return this.characterService
            .getCharacters(
              this.currentPage(),
              this.nameFilter() || undefined,
              this.statusFilter() || undefined,
              this.speciesFilter() || undefined,
            )
            .pipe(
              catchError((err: Error) => {
                this.error.set(err.message);
                this.characters.set([]);
                this.loading.set(false);
                return of(null);
              })
            );
        })
      )
      .subscribe({
        next: (response: CharacterResponse | null) => {
          if (response) {
            this.characters.set(response.results);
            this.totalPages.set(response.info.pages);
            this.loading.set(false);
          }
        },
      });
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
    this.searchSubject.next();
  }

  protected clearFilters(): void {
    this.nameFilter.set('');
    this.statusFilter.set('');
    this.speciesFilter.set('');
    this.currentPage.set(1);
    this.searchSubject.next();
  }

  protected goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  protected openDetail(character: Character): void {
    this.router.navigate(['/characters', character.id]);
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const loader = img.previousElementSibling as HTMLElement;
    if (loader) {
      loader.style.display = 'none';
    }
    // Imagen de placeholder SVG en base64
    img.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3MzczNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
    img.style.objectFit = 'contain';
  }
}
