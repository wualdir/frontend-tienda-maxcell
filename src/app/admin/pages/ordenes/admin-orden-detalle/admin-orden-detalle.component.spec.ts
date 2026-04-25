import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdenDetalleComponent } from './admin-orden-detalle.component';

describe('AdminOrdenDetalleComponent', () => {
  let component: AdminOrdenDetalleComponent;
  let fixture: ComponentFixture<AdminOrdenDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdenDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrdenDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
