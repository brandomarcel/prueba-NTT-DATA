import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddProductComponent } from './add-product.component';
import { ProductsService } from '../../services/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productServiceMock: any;
  let routerMock: any;

  const mockProduct = {
    id: 'test123',
    name: 'Test Product',
    description: 'This is a test product description.',
    logo: 'https://example.com/logo.png',
    date_release: '2024-07-31',
    date_revision: '2025-07-31'
  };

  beforeEach(async () => {
    productServiceMock = {
      addProduct: jest.fn().mockReturnValue(of({ message: 'Producto añadido exitosamente.' })),
      checkProductId: jest.fn().mockReturnValue(of(false))
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    const form = component.productForm;
    expect(form).toBeDefined();
    expect(form.controls['id'].value).toBe('');
    expect(form.controls['name'].value).toBe('');
    expect(form.controls['description'].value).toBe('');
    expect(form.controls['logo'].value).toBe('https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg');
    expect(form.controls['date_release'].value).toBe('');
    expect(form.controls['date_revision'].value).toBe('');
  });

  it('debería validar la fecha de lanzamiento correctamente', () => {
    const control = component.productForm.get('date_release');
    if (control) {
      control.setValue('2022-01-01');
      expect(component.dateReleaseValidator(control)).toEqual({ invalidDate: true });
      control.setValue('2024-07-31');
      expect(component.dateReleaseValidator(control)).toBeNull();
    }
  });

  it('debería validar la fecha de revisión correctamente', () => {
    component.productForm.get('date_release')?.setValue('2024-07-31');
    const control = component.productForm.get('date_revision');
    if (control) {
      control.setValue('2025-07-31');
      expect(component.dateRevisionValidator(control)).toBeNull();
      control.setValue('2025-07-30');
      expect(component.dateRevisionValidator(control)).toEqual({ invalidRevisionDate: true });
    }
  });

  it('debería manejar errores correctamente', () => {
    const error = { message: 'Error intente nuevamente!' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.handleError(error);
    expect(component.errorMessage).toBe('Error intente nuevamente!');

    consoleErrorSpy.mockRestore();
  });

  it('debería agregar un producto y mostrar un mensaje de éxito', fakeAsync(() => {
    component.productForm.setValue(mockProduct);

    component.onSubmit();

    tick();

    expect(productServiceMock.addProduct).toHaveBeenCalledWith(mockProduct);
    expect(component.successMessage).toBe('Producto añadido exitosamente.');

    tick(3000);

    expect(component.successMessage).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería manejar errores al agregar un producto', fakeAsync(() => {
    productServiceMock.addProduct.mockReturnValueOnce(throwError(() => new Error('Error al añadir el producto')));

    component.productForm.setValue(mockProduct);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.onSubmit();

    tick();

    expect(component.errorMessage).toBe('Error al añadir el producto');

    tick(3000);

    expect(component.errorMessage).toBeNull();

    consoleErrorSpy.mockRestore();
  }));

  it('debería resetear el formulario correctamente', () => {
    component.productForm.setValue(mockProduct);

    component.onReset();

    expect(component.productForm.getRawValue()).toEqual({
      id: '',
      name: '',
      description: '',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '',
      date_revision: ''
    });
  });
});
