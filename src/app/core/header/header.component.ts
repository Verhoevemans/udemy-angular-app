import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../shared/data-storage.service';
import { AuthService } from '../../auth/auth.service';
import { Recipe } from '../../models/recipe.model';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    
    isAuthenticated = false;
    
    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.user.subscribe((user: User) => {
            this.isAuthenticated = !!user;
        })
    }

    onFetchData(): void {
        this.dataStorageService.getRecipes().subscribe((recipes) => {
            console.log('recipes were retrieved:', recipes);
        });
    }

    onSaveData(): void {
        this.dataStorageService.storeRecipes().subscribe((response: Recipe[]) => {
            console.log('Save was successful:', response);
        });
    }

    onLogout(): void {
        this.authService.logout();
    }
}
