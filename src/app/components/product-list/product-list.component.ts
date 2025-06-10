import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { PaginatedResponse, Product, ProductService } from '../../services/product.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'price', 'description', 'priceRange', 'countries', 'featuresWant','availability','manufacturingDate','actions'];
  dataSource = new MatTableDataSource<any>([]);

  totalItems = 0;
  currentPage = 0;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {

    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProducts(this.currentPage,this.pageSize).subscribe(response=>{
      this.dataSource.data = response.content;
      this.totalItems = response.totalElements;
    });
  }
  onPageChange(event:any):void {
    this.currentPage=event.pageIndex;
    this.pageSize=event.pageSize;
    this.loadProduct();
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
