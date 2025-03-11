import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  product: Product = { id: undefined, name: '', price: 0, description:'', uploadedfile:null};
  isEditing = false;
  productForm!:FormGroup;
  prouctId: any;
  selectedFile: File |null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    protected router: Router,
    private fb:FormBuilder
  ) {}

  ngOnInit(): void {
    this.prouctId = this.route.snapshot.paramMap.get('id');
    
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      price: ['', [Validators.required, Validators.min(1)]], 
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
    

    if (this.prouctId) {
      this.isEditing = true;
      this.productService.getProductById(+this.prouctId).subscribe((product) => {
        this.productForm.patchValue(product);
      });
    }
  }

  saveProduct() {
    
    if(this.productForm.invalid){
     return;
    }

    let productData = this.productForm.value;
  if (this.selectedFile) {
    productData.file = this.selectedFile; // Add file if selected
  }
    
    const formData = convertToFormData(this.productForm);

    

      if (this.isEditing) {
        if(this.prouctId!==undefined){
          this.productService.updateProduct(this.prouctId, formData).subscribe(() => {
            alert('Product updated successfully!');
            this.router.navigate(['/products']);
          });
        }
        
      } else {
        // this.newProduct.name=this.product.name;
        //this.newProduct.price=this.product.price;
        this.productService.createProduct(formData).subscribe(() => {
          alert('Product created successfully!');
          this.router.navigate(['/products']);
        });
      }

    }

    hasError(controlName: string, errorName: string): boolean {
      return this.productForm.get(controlName)?.hasError(errorName) ?? false;
    }    

    onFileSelected(event: any) {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
      }
      
    }  
}
function convertToFormData(obj: any): FormData {
  const formData = new FormData();
  
  // Ensure we're extracting the actual form values
  const rawValues = obj.value;  

  for (const key in rawValues) {
    if (rawValues[key] !== null && rawValues[key] !== undefined) {
      if (key === 'file' && rawValues[key] instanceof File) {
        formData.append(key, rawValues[key]); // Append file directly
      } else {
        formData.append(key, rawValues[key].toString()); // Convert other values to string
      }
    }
  }

  return formData;
}
