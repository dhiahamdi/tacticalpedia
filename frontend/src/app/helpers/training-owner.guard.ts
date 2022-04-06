import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { TrainingService } from 'app/services/training.service';


@Injectable({ providedIn: 'root' })
export class TrainingOwnerGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private trainingService: TrainingService,
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        try {

            const trainingId = route.queryParams.id;

            if(!trainingId) return false;

            const training = await this.trainingService.getTrainingFromId(trainingId).toPromise();
            const user = await this.authenticationService.getUser().toPromise();

            if (training.user_id != user._id)
                return false; 

            return true;

        } catch(e) {
            console.log(e);
        }
    }
}