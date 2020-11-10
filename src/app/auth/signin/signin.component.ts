import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { delay, take } from 'rxjs/operators';
import { AlertComponent } from '../../shared/alert/alert.component';
import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent {
    
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    
    isLoading = false;
    
    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }
    
    onSignin(form: NgForm): void {
        this.isLoading = true;
        
        this.authService.signinUser(form.value.email, form.value.password)
            .pipe(
                delay(2000)
            )
            .subscribe(
                (response: AuthResponseData) => {
                    console.log(response);
                    this.isLoading = false;
                    this.router.navigate(['/recipes']);
                }, (errorMessage) => {
                    this.showErrorAlert(errorMessage);
                    this.isLoading = false;
                }
            );
    }
    
    showErrorAlert(errorMessage: string): void {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        
        hostViewContainerRef.clear();
        const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
        
        alertComponentRef.instance.message = errorMessage;
        alertComponentRef.instance.close
            .pipe(take(1))
            .subscribe(() => {
                hostViewContainerRef.clear();
            });
    }
}
