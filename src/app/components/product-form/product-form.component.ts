import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryMasterData, Product, ProductRange, ProductService } from '../../services/product.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';



@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatOption
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  product: Product = {
    id: undefined, name: '', price: 0, description: '', uploadedfile: null,
    productRange: {} as ProductRange,
    countries: {} as CountryMasterData
  };
  productRange: ProductRange[] = [];
  countryMasterData: CountryMasterData[] = [];
  isEditing = false;
  productForm!: FormGroup;
  prouctId: any;
  selectedFile: File | null = null;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    protected router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.productService.getRange().subscribe((rangeData: ProductRange[]) => {
      this.productRange = rangeData;
      console.log("Product Range Data:", this.productRange);
    });
    
    

    this.productService.getCountryData().subscribe((countryData: CountryMasterData[]) => {
      this.countryMasterData = countryData; // Assign to an array
      console.log("Country Data:", this.countryMasterData);
    });



    this.prouctId = this.route.snapshot.paramMap.get('id');

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      productRange: ['', Validators.required], 
      countryIds: [[], Validators.required],
    });


    if (this.prouctId) {
      this.isEditing = true;
      this.productService.getProductById(+this.prouctId).subscribe((product) => {
        console.log("Product Data:", this.product);
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          productRange: product.productRange?.id ?? null,
          countryIds: Array.isArray(product.countries) 
            ? product.countries.map((c: any) => c.id) 
            : [] 
        });
      });
    }
  }

  saveProduct() {

    if (this.productForm.invalid) {
      return;
    }

    let productData = this.productForm.value;
    if (this.selectedFile) {
      productData.file = this.selectedFile; // Add file if selected
    }

    const formData = convertToFormData(this.productForm);



    if (this.isEditing) {
      if (this.prouctId !== undefined) {
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
  const rawValues = obj.value;
  
  for (const key in rawValues) {
    if (rawValues[key] !== null && rawValues[key] !== undefined) {
      if (key === 'file' && rawValues[key] instanceof File) {
        formData.append(key, rawValues[key]); // Append file directly
      } else if (key === 'countryIds' && Array.isArray(rawValues[key])) {
        rawValues['countryIds'].forEach((id: number) => {
          formData.append('countryIds', id.toString());  // Append values separately
        });
      } else {
        formData.append(key, rawValues[key].toString());
      }
    }
  }
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  

  return formData;
}
