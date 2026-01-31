import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Character, CharacterResponse, Episode } from '../models/character.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5262/api';

  getCharacters(
    page: number = 1,
    name?: string,
    status?: string,
    species?: string,
  ): Observable<CharacterResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (species) {
      params = params.set('species', species);
    }

    return this.http
      .get<CharacterResponse>(`${this.apiUrl}/characters`, { params })
      .pipe(catchError(this.handleError));
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http
      .get<Character>(`${this.apiUrl}/characters/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEpisode(url: string): Observable<Episode> {
    return this.http.get<Episode>(url).pipe(catchError(this.handleError));
  }

  getMultipleEpisodes(ids: number[]): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(`${this.apiUrl}/episode/${ids.join(',')}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = 'No se encontraron resultados';
      } else if (error.status === 0) {
        errorMessage = 'Error de conexión';
      } else {
        errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
