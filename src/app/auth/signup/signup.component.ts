import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';
import { AlertComponent } from '../../shared/alert/alert.component';
import * as AuthActions from '../store/auth.actions';
import * as fromApp from '../store/auth.reducer';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    
    isLoading = false;
    storeSubscription: Subscription;
    
    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private store: Store<fromApp.State>) { }
    
    ngOnInit(): void {
        this.storeSubscription = this.store.select('auth').subscribe((authState) => {
            this.isLoading = authState.loading;
            if (authState.authError) {
                this.showErrorAllert(authState.authError);
            }
        })
    }
    
    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    onSignup(form: NgForm): void {
        this.store.dispatch(new AuthActions.SignupStart({
            email: form.value.email,
            password: form.value.password
        }));
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
