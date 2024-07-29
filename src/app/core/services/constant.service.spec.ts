import { TestBed } from '@angular/core/testing';
import { ConstantService } from './constant.service';
import { environment } from '../../../environments/environment';

describe('ConstantService', () => {
  let service: typeof ConstantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = ConstantService;
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar la URL base correcta', () => {
    expect(service['base_url']).toBe(environment.backEnd);
  });

  it('debería retornar la URL correcta del producto', () => {
    const expectedUrl = `${environment.backEnd}${service['bp']}products/`;
    expect(service.product).toBe(expectedUrl);
  });
});
