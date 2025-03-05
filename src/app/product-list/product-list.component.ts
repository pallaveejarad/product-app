import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'price', 'description', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.dataSource.data = data; // Ensure table updates properly
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
    });
  }

  editProduct(id: number) {
    if (id !== undefined) {
      this.router.navigate([`/products/edit-product`, id]); // Navigate to the edit page
    }
  }

  addProduct() {
    this.router.navigate([`/products/add-product`]); // Navigate to the add page
  }
}
