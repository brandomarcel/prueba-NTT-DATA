import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EditProductComponent } from './edit-product.component';
import { ProductsService } from '../../services/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const mockProduct = {
    id: 'uno',
    name: 'Product 1',
    description: 'Description 1',
    logo: 'logo1.png',
    date_release: '2024-07-31',
    date_revision: '2025-07-31'
  };

  beforeEach(async () => {
    productServiceMock = {
      getProductById: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of({ message: 'Producto actualizado exitosamente.' }))
    };
    

    routerMock = {
      navigate: jest.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('uno')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [EditProductComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto en el formulario al inicializar', () => {
    expect(component.editProductForm.getRawValue()).toEqual({
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      logo: mockProduct.logo,
      date_release: mockProduct.date_release,
      date_revision: mockProduct.date_revision
    });
  });

  it('debería mostrar un mensaje de éxito al actualizar el producto', fakeAsync(() => {
    component.editProductForm.get('id')?.enable();

    component.editProductForm.setValue({
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      logo: mockProduct.logo,
      date_release: '2024-07-31',
      date_revision: '2025-07-31'
    });
    
    fixture.detectChanges();
    component.onSubmit();

    expect(component.editProductForm.valid).toBe(true);

    

    tick();

    expect(productServiceMock.updateProduct).toHaveBeenCalledWith('uno', component.editProductForm.getRawValue());

    expect(component.successMessage).toBe('Producto actualizado exitosamente.');

    tick(3000);

    expect(component.successMessage).toBeNull();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería manejar errores al actualizar el producto', fakeAsync(() => {
    productServiceMock.updateProduct.mockReturnValueOnce(throwError(() => new Error('Error de actualización')));

    component.editProductForm.setValue({
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      logo: mockProduct.logo,
      date_release: '2024-07-30',
      date_revision: '2025-07-30'
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.onSubmit();

    fixture.detectChanges();

    tick();

    expect(component.errorMessage).toBe('Error de actualización');

    tick(3000);

    expect(component.errorMessage).toBeNull();

    consoleErrorSpy.mockRestore();
  }));

  it('debería resetear el formulario correctamente', () => {
    component.onReset();
    expect(component.editProductForm.getRawValue().id).toBe(mockProduct.id);
  });

  it('debería validar correctamente la fecha de lanzamiento', () => {
    const control = component.editProductForm.get('date_release');
    if (control) {
      control.setValue('2022-01-01');
      expect(component.dateReleaseValidator(control)).toEqual({ invalidDate: true });
      control.setValue('2024-07-30');
      expect(component.dateReleaseValidator(control)).toBeNull();
    }
  });

  it('debería validar correctamente la fecha de revisión', () => {
    component.editProductForm.get('date_release')?.setValue('2023-01-01');
    const control = component.editProductForm.get('date_revision');
    if (control) {
      control.setValue('2024-01-01');
      expect(component.dateRevisionValidator(control)).toBeNull();
      control.setValue('2023-12-31');
      expect(component.dateRevisionValidator(control)).toEqual({ invalidRevisionDate: true });
    }
  });

  
});
