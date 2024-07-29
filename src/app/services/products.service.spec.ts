import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstantService } from '../core/services/constant.service';
import { Product, ProductResponse } from '../interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' },
    { id: '2', name: 'Product 2', description: 'Description 2', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' }
  ];
  const productResponse: ProductResponse = { data: mockProducts };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener productos', () => {
    service.getProducts().subscribe((response:any) => {
      expect(response).toEqual(productResponse);
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('GET');
    req.flush(productResponse);
  });

  it('debería manejar errores al obtener productos', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Error products',
      status: 500,
      statusText: 'Internal Server Error'
    });

    service.getProducts().subscribe({
      next: () => fail('esperado error, pero no ocurrió'),
      error: (error:any) => {
        expect(error.message).toContain('Error products');
      }
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('GET');
    req.flush('Error products', errorResponse);
  });

  it('debería obtener un producto por ID', () => {
    const productId = '1';
    const product = mockProducts.find(p => p.id === productId);

    service.getProductById(productId).subscribe((response:any) => {
      expect(response).toEqual(product);
    });

    const req = httpMock.expectOne(`${service['product_URL']}${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(product!);
  });

  it('debería manejar errores al obtener un producto por ID', () => {
    const productId = '1';
    const errorResponse = new HttpErrorResponse({
      error: `Error fetching product with ID ${productId}`,
      status: 404,
      statusText: 'Not Found'
    });

    service.getProductById(productId).subscribe({
      next: () => fail('esperado error, pero no ocurrió'),
      error: (error:any) => {
        expect(error.message).toContain(`Error fetching product with ID ${productId}`);
      }
    });

    const req = httpMock.expectOne(`${service['product_URL']}${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(`Error fetching product with ID ${productId}`, errorResponse);
  });

  it('debería añadir un producto', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' };

    service.addProduct(newProduct).subscribe((response:any) => {
      expect(response).toEqual(newProduct);
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('debería manejar errores al añadir un producto', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' };
    const errorResponse = new HttpErrorResponse({
      error: 'Error add product',
      status: 400,
      statusText: 'Bad Request'
    });

    service.addProduct(newProduct).subscribe({
      next: () => fail('esperado error, pero no ocurrió'),
      error: (error:any) => {
        expect(error.message).toContain('Error add product');
      }
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('POST');
    req.flush('Error add product', errorResponse);
  });

  it('debería actualizar un producto', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' };

    service.updateProduct(updatedProduct.id, updatedProduct).subscribe((response:any) => {
      expect(response).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${service['product_URL']}${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('debería manejar errores al actualizar un producto', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: '', date_release: '2023-01-01', date_revision: '2024-01-01' };
    const errorResponse = new HttpErrorResponse({
      error: 'Error updating product',
      status: 400,
      statusText: 'Bad Request'
    });

    service.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => fail('esperado error, pero no ocurrió'),
      error: (error:any) => {
        expect(error.message).toContain('Error updating product');
      }
    });

    const req = httpMock.expectOne(`${service['product_URL']}${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating product', errorResponse);
  });

  it('debería eliminar un producto', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe((response:any) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['product_URL']}${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar errores al eliminar un producto', () => {
    const productId = '1';
    const errorResponse = new HttpErrorResponse({
      error: 'Error deleting product',
      status: 400,
      statusText: 'Bad Request'
    });

    service.deleteProduct(productId).subscribe({
      next: () => fail('esperado error, pero no ocurrió'),
      error: (error:any) => {
        expect(error.message).toContain('Error deleting product');
      }
    });

    const req = httpMock.expectOne(`${service['product_URL']}${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error deleting product', errorResponse);
  });

  it('debería verificar el ID del producto', () => {
    const productId = '1';

    service.checkProductId(productId).subscribe((exists:any) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('GET');
    req.flush(productResponse);
  });

  it('debería manejar errores al verificar el ID del producto', () => {
    const productId = '1';
    const errorResponse = new HttpErrorResponse({
      error: 'Error checking product ID',
      status: 500,
      statusText: 'Internal Server Error'
    });

    service.checkProductId(productId).subscribe((exists:any) => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne(service['product_URL']);
    expect(req.request.method).toBe('GET');
    req.flush('Error checking product ID', errorResponse);
  });
});
