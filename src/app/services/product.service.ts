import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  uploadedfile?: File | null;
  productRange: ProductRange;
  countries:CountryMasterData[];
  availability: string;
  featuresWant: string;
  manufacturingDate: string | Date;
}

export interface PaginatedResponse { 
  content: Product[],
  totalElements: number;  

}

export interface ProductRange {
  id: number;
  priceRange: string;
}

export interface CountryMasterData {
  id: number;
  countryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(formData: FormData): Observable<Product> {
    console.log('Sending product:', formData); // Debugging line
    return this.http.post<Product>(this.apiUrl, formData);
}


  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getRange(): Observable<ProductRange[]>{
   return this.http.get<ProductRange[]>(`${this.apiUrl}/getProductRange`);
  }

  getCountryData(): Observable<CountryMasterData[]>{
    return this.http.get<CountryMasterData[]>(`${this.apiUrl}/getCountryMasterData`);
   }

}
