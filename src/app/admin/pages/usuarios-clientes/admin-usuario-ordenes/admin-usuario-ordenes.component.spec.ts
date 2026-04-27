import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsuarioOrdenesComponent } from './admin-usuario-ordenes.component';

describe('AdminUsuarioOrdenesComponent', () => {
  let component: AdminUsuarioOrdenesComponent;
  let fixture: ComponentFixture<AdminUsuarioOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsuarioOrdenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsuarioOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
