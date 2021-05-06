import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth/store/auth.actions';
import * as fromAppReducer from './store/app.reducer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loadedFeature = 'recipe';
    
    constructor(private store: Store<fromAppReducer.AppState>,
                @Inject(PLATFORM_ID) private platformId) {
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(new AuthActions.AutoLogin());
        }
    }

    onNavigate(feature: string) {
        this.loadedFeature = feature;
    }
}
