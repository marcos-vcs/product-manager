import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTrashComponent } from './supplier-trash.component';

describe('SupplierTrashComponent', () => {
  let component: SupplierTrashComponent;
  let fixture: ComponentFixture<SupplierTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierTrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
