import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingCategory } from 'app/interfaces/training-category';
import { TrainingSelectTaxonomy } from 'app/interfaces/training-select-taxonomy';
import { TrainingTaxonomy } from 'app/interfaces/training-taxonomy';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingCustomizeService {

  constructor(
    private http: HttpClient
  ) { }


  syncCategories(categories: TrainingCategory[]) : Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_SYNC_CATEGORIES, categories);
  }

  getCategories() : Observable<TrainingCategory[]> {
    return this.http.get<TrainingCategory[]>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_GET_CATEGORIES)
  }

  syncTaxonomies(taxonomies: TrainingTaxonomy[]) : Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_SYNC_TAXONOMIES, taxonomies);
  }

  getTaxonomies() : Observable<TrainingTaxonomy[]> {
    return this.http.get<TrainingTaxonomy[]>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_GET_TAXONOMIES);
  }

  getUserTaxonomies(userId: string) : Observable<TrainingTaxonomy[]> {
    return this.http.get<TrainingTaxonomy[]>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_GET_TAXONOMIES + '/' + userId);
  }

  getSelectTaxonomies() : Observable<TrainingSelectTaxonomy[]> {
    return this.http.get<TrainingSelectTaxonomy[]>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_GET_SELECT_TAXONOMIES);
  }

  syncSelectTaxonomies(taxonomies: TrainingSelectTaxonomy[]) : Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_CUSTOMIZE_SYNC_SELECT_TAXONOMIES, taxonomies);
  }
  

}
