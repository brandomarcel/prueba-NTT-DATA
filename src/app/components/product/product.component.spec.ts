import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productServiceMock: any;
  let routerMock: any;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Descripción 1',
      logo: 'logo1.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Descripción 2',
      logo: 'logo2.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Producto eliminado exitosamente.' }))
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        { provide: ProductsService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.paginatedProducts.length).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('debería navegar a agregar producto', () => {
    component.addProduct();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('debería navegar a editar producto', () => {
    const productId = '1';
    component.editProduct(productId);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit-product', productId]);
  });

  it('debería confirmar eliminación del producto', () => {
    const productId = '1';
    component.confirmDeleteProduct(productId);
    expect(component.productIdToDelete).toBe(productId);
    expect(component.showDeleteModal).toBe(true);
  });

  it('debería cancelar la eliminación', () => {
    component.cancelDelete();
    expect(component.showDeleteModal).toBe(false);
    expect(component.productIdToDelete).toBeNull();
  });

  it('debería eliminar el producto', () => {
    const productId = '1';
    component.confirmDeleteProduct(productId);
    component.deleteProduct();
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(productId);
    expect(component.products.length).toBe(1);
    expect(component.successMessage).toBe('Producto eliminado exitosamente.');
  });

  it('debería manejar la búsqueda', () => {
    const event = { target: { value: 'Product 1' } } as unknown as Event;
    component.search(event);
    expect(component.searchTerm).toBe('product 1');
    expect(component.filteredProducts.length).toBe(1);
  });

  it('debería manejar el cambio de tamaño de página', () => {
    const event = { target: { value: '1' } } as unknown as Event;
    component.changePageSize(event);
    expect(component.pageSize).toBe(1);
    expect(component.paginatedProducts.length).toBe(1);
  });

  it('debería manejar errores', () => {
    const error = { message: 'Error intente nuevamente!' };

    // Espiar console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.handleError(error);
    expect(component.errorMessage).toBe('Error intente nuevamente!');

    // Restaurar console.error
    consoleErrorSpy.mockRestore();
  });


});
