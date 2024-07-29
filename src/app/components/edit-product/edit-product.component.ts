import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  productId: string='';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editProductForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateReleaseValidator.bind(this)]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.editProductForm.patchValue(product);
      },
      error: err => this.handleError(err)
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
    const releaseDate = new Date(this.editProductForm?.get('date_release')?.value);
    const revisionDate = new Date(control.value);
    const sumYear = new Date(releaseDate);
    sumYear.setFullYear(releaseDate.getFullYear() + 1);
    return revisionDate.getTime() === sumYear.getTime() ? null : { invalidRevisionDate: true };
  }
  
  

  validationTouched(): void {
    Object.values(this.editProductForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onSubmit(): void {
    this.validationTouched();
  
    if (this.editProductForm.valid) {
      this.productService.updateProduct(this.productId, this.editProductForm.getRawValue()).subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'Producto actualizado exitosamente.';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/']);
          }, 3000);
        },
        error: err => this.handleError(err)
      });
    }
  }
  

  private handleError(error: any) {
    this.errorMessage = error.message || 'Error intente nuevamente!';
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  onReset(): void {
    this.editProductForm.reset();
    this.editProductForm.patchValue({id:this.productId});
  }
}
