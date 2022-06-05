import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTrashComponent } from './client-trash.component';

describe('ClientTrashComponent', () => {
  let component: ClientTrashComponent;
  let fixture: ComponentFixture<ClientTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTrashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
