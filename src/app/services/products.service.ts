import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../core/services/constant.service';
import { Product, ProductResponse } from '../interfaces/product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private product_URL = ConstantService.product;

  constructor(private http:HttpClient) { }


  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.product_URL).pipe(
      catchError((error) => {
        console.error('Error products:', error);
        return throwError(() => new Error('Error products'));
      })
    );
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.product_URL}${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching product with ID ${id}:`, error);
        return throwError(() => new Error(`Error fetching product with ID ${id}`));
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.product_URL, product).pipe(
      catchError((error) => {
        console.error('Error add product:', error);
        return throwError(() => new Error('Error add product'));
      })
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.product_URL}${id}`, product).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Error updating product'));
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.product_URL}${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Error deleting product'));
      })
    );
  }

  checkProductId(id: string): Observable<boolean> {
    return this.http.get<ProductResponse>(this.product_URL).pipe(
      map(response => response.data.some(product => product.id === id)),
      catchError((error) => {
        console.error('Error checking product ID:', error);
        return of(false);
      })
    );
  }

}