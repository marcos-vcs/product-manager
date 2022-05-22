import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTrashComponent } from './product-trash.component';

describe('ProductTrashComponent', () => {
  let component: ProductTrashComponent;
  let fixture: ComponentFixture<ProductTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
