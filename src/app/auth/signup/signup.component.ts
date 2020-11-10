import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthResponseData, AuthService } from '../auth.service';
import { delay, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    
    isLoading = false;
    
    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) { }
    
    onSignup(form: NgForm): void {
        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;
        
        this.authService.signupUser(email, password)
            .pipe(
                delay(2000)
            )
            .subscribe(
                (response: AuthResponseData) => {
                    console.log(response);
                    this.isLoading = false;
                    this.router.navigate(['/recipes']);
                }, (errorMessage) => {
                    this.showErrorAllert(errorMessage);
                    this.isLoading = false;
                }
            );
    }
    
    showErrorAllert(errorMessage: string): void {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const alertHostViewContainterRef = this.alertHost.viewContainerRef;
        alertHostViewContainterRef.clear();
        
        const alertComponentRef = alertHostViewContainterRef.createComponent(alertComponentFactory);
        alertComponentRef.instance.message = errorMessage;
        alertComponentRef.instance.close
            .pipe(take(1))
            .subscribe(() => {
                alertHostViewContainterRef.clear();
            });
    }
}
