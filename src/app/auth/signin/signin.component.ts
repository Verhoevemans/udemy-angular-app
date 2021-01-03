import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AlertComponent } from '../../shared/alert/alert.component';
import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';
import * as AuthActions from '../store/auth.actions';
import * as fromApp from '../store/auth.reducer';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
    
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    
    isLoading = false;
    storeSubscription: Subscription;
    
    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private store: Store<fromApp.State>) {
    }
    
    ngOnInit(): void {
        this.storeSubscription = this.store.select('auth').subscribe((authState) => {
            this.isLoading = authState.loading;
            if (authState.authError) {
                this.showErrorAlert(authState.authError);
            }
        });
    }
    
    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    
    onSignin(form: NgForm): void {
        this.store.dispatch(new AuthActions.LoginStart({
            email: form.value.email,
            password: form.value.password
        }));
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
