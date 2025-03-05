import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../product.service';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface BackendErrors{
  name?: string,
  price?:string,
  description?: string;
}

@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = { id: undefined, name: '', price: 0, description:''};
  isEditing = false;
  backendErrors: BackendErrors = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    protected router: Router,
    private fb:FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // this.productForm= this.fb.group({
    //   name:['',Validators.required, Validators.maxLength(10),Validators.minLength(2)],
    //   price:['',Validators.required,Validators.minLength(1)],
    //   description:['',Validators.required, Validators.maxLength(100),Validators.minLength(2)]
    // });
    if (id) {
      this.isEditing = true;
      this.productService.getProductById(+id).subscribe((data) => {
        this.product = data;
      });
    }
  }

  saveProduct() {
    
      if (this.isEditing) {
        if(this.product.id!==undefined){
          this.productService.updateProduct(this.product.id, this.product).subscribe(() => {
            alert('Product updated successfully!');
            this.router.navigate(['/products']);
          });
        }
        
      } else {
        // this.newProduct.name=this.product.name;
        //this.newProduct.price=this.product.price;
        this.productService.createProduct(this.product).subscribe(() => {
          alert('Product created successfully!');
          this.router.navigate(['/products']);
        });
      }

    }
    
  }

