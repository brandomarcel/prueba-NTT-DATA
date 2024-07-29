import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  pageSize: number = 5;
  searchTerm: string = '';
  showDeleteModal: boolean = false;
  productIdToDelete: string | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = response.data;
        this.paginate();
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err)
        this.loading = false;
      }
    });
  }
  addProduct(): void {
    this.router.navigate(['/add-product']);
  }
  editProduct(id: string): void {
    this.router.navigate(['/edit-product', id]);
  }

  confirmDeleteProduct(id: string): void {
    this.productIdToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productIdToDelete = null;
  }

  deleteProduct(): void {
    if (this.productIdToDelete) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: (res: any) => {
          this.products = this.products.filter(p => p.id !== this.productIdToDelete);
          this.successMessage = res.message || 'Producto eliminado exitosamente.';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
          this.filterInfo();
          this.cancelDelete();
        },
        error: err => this.handleError(err)
      });
    }
  }

  search(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterInfo();
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = +select.value;
    this.paginate();
  }

  filterInfo(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm) ||
      product.description.toLowerCase().includes(this.searchTerm)
    );
    this.paginate();
  }

  paginate(): void {
    this.paginatedProducts = this.filteredProducts.slice(0, this.pageSize);
  }

  public handleError(error: any) {
    this.errorMessage = error.message || 'Error intente nuevamente!';
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  toggleDropdown(event: Event) {
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (dropdown)
      dropdown.classList.toggle('show');
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  }

}