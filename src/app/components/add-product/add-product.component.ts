import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { ProductsService } from '../../services/products.service';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', Validators.required],
      date_release: ['', [Validators.required, this.dateReleaseValidator.bind(this)]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator.bind(this)]]
    });
  }


  dateReleaseValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { invalidDate: true };
  }
  

  dateRevisionValidator(control: AbstractControl): ValidationErrors | null {
    const releaseDate = new Date(this.productForm?.get('date_release')?.value);
    const revisionDate = new Date(control.value);
    const sumYear = new Date(releaseDate);
    sumYear.setFullYear(releaseDate.getFullYear() + 1);
    return revisionDate.getTime() === sumYear.getTime() ? null : { invalidRevisionDate: true };
  }

  idValidator(id: string): Observable<ValidationErrors | null> {
    return this.productService.checkProductId(id).pipe(
      map(isTaken => (isTaken ? { idTaken: true } : null))
    );
  }

  validationTouched(): void {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onSubmit(): void {
    this.validationTouched();
  
    if (this.productForm.valid) {
      this.idValidator(this.productForm.value.id).subscribe({
        next: (validationResult) => {
          if (validationResult === null) {
            this.productService.addProduct(this.productForm.value).subscribe({
              next: (res: any) => {
                this.successMessage = res.message || 'Producto añadido exitosamente.';
                setTimeout(() => {
                  this.successMessage = null;
                  this.router.navigate(['/']);
                }, 3000);
              },
              error: (err) => this.handleError(err)
            });
          } else {
            this.productForm.controls['id'].setErrors(validationResult);
          }
        },
        error: (error) => this.handleError(error)
      });
    }
  }
  

  public handleError(error: any) {
    this.errorMessage = error.message || 'Error intente nuevamente!';
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  onReset(): void {
    this.productForm.reset({
      id: '',
      name: '',
      description: '',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '',
      date_revision: ''
    });
  }
  

}

