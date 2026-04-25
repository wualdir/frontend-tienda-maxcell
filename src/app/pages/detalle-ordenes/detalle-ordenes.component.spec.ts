import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOrdenesComponent } from './detalle-ordenes.component';

describe('DetalleOrdenesComponent', () => {
  let component: DetalleOrdenesComponent;
  let fixture: ComponentFixture<DetalleOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleOrdenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
