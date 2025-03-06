import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
  template: `
<app-header></app-header>
<div class="main-content">
    <nav>
      <a routerLink="/products">Product List</a> |
      <a routerLink="/products/add-product">Add Product</a>
    </nav>
    <router-outlet></router-outlet>
</div>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: any;
}
