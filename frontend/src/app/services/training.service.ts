import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Training } from 'app/interfaces/training';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Training as TrainingModel } from 'app/components/training-library/training.model';
import { TrainingDraft } from 'app/interfaces/training-draft';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private pageNr = 1; //page number needed for lazy loading
  private amount = 12; //number to items to load in each page of lazy loading

  private currentTraining: TrainingModel;
  private currentVisibility: string;
  private currentCategory: string;
  private searchInput: string;
  private currentSelectTaxonomies;
  private currentSelectedTrainings;
  private currentFilteredTrainings: string[];

  onCurrentTrainingChanged: BehaviorSubject<any>;
  onCurrentVisibilityChanged: BehaviorSubject<any>;
  onCurrentCategoryChanged: BehaviorSubject<any>;
  onSearchTextChanged: BehaviorSubject<any>;
  onCurrentSelectTaxonomiesChanged: BehaviorSubject<any>;
  onCurrentSelectedTrainingsChanged: BehaviorSubject<string[]>;


  constructor(private http: HttpClient) { 

    //set default behaviors
    this.currentSelectedTrainings = [];
    this.onCurrentTrainingChanged = new BehaviorSubject(this.currentTraining);
    this.onCurrentVisibilityChanged = new BehaviorSubject(this.currentVisibility);
    this.onCurrentCategoryChanged = new BehaviorSubject(this.currentCategory);
    this.onSearchTextChanged = new BehaviorSubject(this.searchInput);
    this.onCurrentSelectTaxonomiesChanged = new BehaviorSubject(this.currentSelectTaxonomies);
    this.onCurrentSelectedTrainingsChanged = new BehaviorSubject(this.currentSelectedTrainings);

  }

  resetPageNumber(){
    this.pageNr = 1;
  }

  async insertTraining(training: Training): Promise<string>{

    try{

      const trainingId = await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_INSERT, training).toPromise();
      return String(trainingId.trainingId);
    
    }catch(e){

      throw(e);
    }
  }

  async editTraining(training: Training): Promise<string>{

    try{

      const trainingId = await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_EDIT, training).toPromise();
      return trainingId;
      
    }catch(e){

      throw(e);
    }
  }

  deleteTrainings(trainingIds: string[]): Observable<any>{

    return this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_DELETE, {trainingIds: trainingIds});
  }

  async insertDraft(trainingDraft: TrainingDraft): Promise<string>{

    try{

    const trainingId = await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_DRAFT_INSERT, trainingDraft).toPromise()
    return String(trainingId.trainingId);

    }catch(e){

      throw(e);
    }
  }

  async addImagesToTraining(trainingImages: FormData): Promise<void>{

    try{

      const trainingImageResult = await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_ADD_IMAGES, trainingImages).toPromise();
      return;

    }catch(e){

      throw(e);
    }

  }

  async deleteImagesFromTraining(trainingId: string): Promise<void>{

    try{

      await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_DELETE_IMG, {_id: trainingId}).toPromise();
      return

    }catch(e){

      throw(e);
    }
  }

  
  async deleteFilesFromTraining(trainingId: string): Promise<void>{

    try{

      await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_DELETE_FILES, {_id: trainingId}).toPromise();
      return

    }catch(e){

      throw(e);
    }
  }

  async addFilesToTraining(trainingFiles: FormData): Promise<void>{

    try{
      const trainingFilesResult = await this.http.post<any>(environment.apiUrl + BackendRoutes.TRAINING_ADD_FILES, trainingFiles).toPromise();
      return

    }catch(e){

      throw(e);
    }
  }

  /**
   * get all public trainings
   * 
   * @param 
   * @returns 
   */
  // getPublicTrainings(): Observable<Training[]>{

  //   return this.http.get<Training[]>(environment.apiUrl + BackendRoutes.TRAININGS_PUBLIC);
  // }

  /**
   * get public training in a lazy way
   * 
   * @returns 
   */
  getPublicTrainingsLazy(filters: any): Observable<Training[]>{
    return this.http.post<Training[]>(environment.apiUrl + BackendRoutes.TRAININGS_PUBLIC_LAZY+this.pageNr+"/amount/"+this.amount, {filters});
  }

  /**
   * get tacticalpad images/video paths
   * 
   * @param tactical_pad_publishing_id
   * @param training_id
   * 
   * @return array of paths
   */
   getTacticalPadImgPaths(tacticalpad_publishing_id: string, trainingId: string): Observable<string[]>{

    return this.http.post<string[]>(environment.apiUrl + BackendRoutes.TRAINING_TACTICALPAD_IMG_PATHS, {_id: trainingId, tacticalpad_publishing_id: tacticalpad_publishing_id})
   }

   /**
   * get tacticalpad non video/img file paths
   * 
   * @param tactical_pad_publishing_id
   * @param training_id
   * 
   * @return array of paths
   */
    getTacticalPadFilePaths(tacticalpad_publishing_id: string, trainingId: string): Observable<string[]>{

      return this.http.post<string[]>(environment.apiUrl + BackendRoutes.TRAINING_TACTICALPAD_FILE_PATHS, {_id: trainingId, tacticalpad_publishing_id: tacticalpad_publishing_id})
     }

  /**
   * Increment number of page for lazy loading
   */
  paginatePage(): void {
    this.pageNr ++;
  }

  getTrainings(): Observable<Training []> {

    return this.http.get<Training []>(environment.apiUrl + BackendRoutes.TRAININGS);

  }

  getUserPublicTrainings(user_id: string): Observable<Training[]>{

    return this.http.post<Training[]>(environment.apiUrl + BackendRoutes.USER_PUBLIC_TRAININGS, {user_id: user_id});
  }

  getDrafts(): Observable<TrainingDraft[]>{

    return this.http.get<TrainingDraft[]>(environment.apiUrl + BackendRoutes.TRAINING_DRAFTS);
  }

  getTrainingImg(imagePath: string, trainingId: string): Observable<Blob> {

    return this.http.post(environment.apiUrl + BackendRoutes.TRAINING_IMG, {imagePath: imagePath, _id: trainingId}, {responseType: "blob"});
  }

  getTrainingCover(trainingId: string): Observable<Blob>{

    return this.http.post(environment.apiUrl + BackendRoutes.TRAINING_COVER, {_id: trainingId}, {responseType: "blob"});
  }

  getTrainingVideoThumb(trainingId: string): Observable<Blob>{
    return this.http.post(environment.apiUrl + BackendRoutes.TRAINING_VIDEO_THUMB, {_id: trainingId}, {responseType: "blob"});
  }

  getTrainingFile(filePath: string, trainingId: string): Observable<Blob> {

    return this.http.post(environment.apiUrl + BackendRoutes.TRAINING_FILE, {filePath: filePath, _id: trainingId}, {responseType: "blob"});
  }

  getTrainingFromId(trainingId: string, options?: any): Observable<Training> {
    return this.http.post<Training>(environment.apiUrl + BackendRoutes.TRAINING_FROM_ID, {_id: trainingId, options: options});
  }


  setCurrentTraining(training){
    this.currentTraining = training;
    this.onCurrentTrainingChanged.next(this.currentTraining);
  }

  setCurrentVisibility(visibility: string){
    this.currentVisibility = visibility;
    this.onCurrentVisibilityChanged.next(this.currentVisibility);
  }

  setCurrentCategory(category: string){
    this.currentCategory = category;
    this.onCurrentCategoryChanged.next(this.currentCategory);
  }

  setCurrentTaxonomies(taxonomies: any) {
    this.currentSelectTaxonomies = taxonomies;
    this.onCurrentSelectTaxonomiesChanged.next(this.currentSelectTaxonomies);
  }

  setCurrentFilteredTrainings(trainings: string[]){
    this.currentFilteredTrainings = trainings;
  }

  getCurrentTaxonomies(){

    return this.currentSelectTaxonomies;
  }

  toggleSelectedTraining(trainingId: string){

    //if some training are already selected
    if(this.currentSelectedTrainings.length > 0){

      //if our training is already selected it need to be unselected
      for(const training of this.currentSelectedTrainings){

        if(training == trainingId){

          const index = this.currentSelectedTrainings.indexOf(training);

          if(index !== -1){

            this.currentSelectedTrainings.splice(index, 1);

            // Trigger the next event
            this.onCurrentSelectedTrainingsChanged.next(this.currentSelectedTrainings);

            // Return
            return;

          }
        }
      }
    }

    //if we can't find the training in the selected list we add it
    // If we don't have it, push as selected
    this.currentSelectedTrainings.push(trainingId);

    // Trigger the next event
    this.onCurrentSelectedTrainingsChanged.next(this.currentSelectedTrainings);

  }

  toggleSelectAll(){

    if ( this.currentSelectedTrainings.length > 0 )
    {
      this.resetSelectedTrainingList();
    }
    else
    {
      this.currentSelectedTrainings = [...this.currentFilteredTrainings]; // need a copy of that array
      this.onCurrentSelectedTrainingsChanged.next(this.currentSelectedTrainings);
    }
  }

  resetSelectedTrainingList(){

    this.currentSelectedTrainings = [];
    this.onCurrentSelectedTrainingsChanged.next(this.currentSelectedTrainings);
  }

  getSelectedTrainings(){

    return this.currentSelectedTrainings;
  }

}
