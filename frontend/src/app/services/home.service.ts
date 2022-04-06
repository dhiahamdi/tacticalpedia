import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private currentCategory: string;
  private currentSelectTaxonomies;
  private currentSearchInput: string;

  onCurrentCategoryChanged: BehaviorSubject<any>;
  onCurrentSelectTaxonomiesChanged: BehaviorSubject<any>;
  onCurrentSearchInputChanged: BehaviorSubject<any>

  constructor() 
  { 
    //set default behaviors
    this.onCurrentCategoryChanged = new BehaviorSubject(this.currentCategory);
    this.onCurrentSelectTaxonomiesChanged = new BehaviorSubject(this.currentSelectTaxonomies);
    this.onCurrentSearchInputChanged = new BehaviorSubject(this.currentSearchInput);
  }

  setCurrentCategory(category: string){
    this.currentCategory = category;
    this.onCurrentCategoryChanged.next(this.currentCategory);
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  setCurrentTaxonomies(taxonomies: any) {
    this.currentSelectTaxonomies = taxonomies;
    this.onCurrentSelectTaxonomiesChanged.next(this.currentSelectTaxonomies);
  }

  getCurrentTaxonomies() {
    return this.currentSelectTaxonomies;
  }

  setCurrentSearchInput(searchInput: string){
    this.currentSearchInput = searchInput;
    this.onCurrentSearchInputChanged.next(this.currentSearchInput);
  }

  getCurrentSearchInput() {
    return this.currentSearchInput;
  }
}
