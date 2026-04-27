import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListUsuariosComponent } from './admin-list-usuarios.component';

describe('AdminListUsuariosComponent', () => {
  let component: AdminListUsuariosComponent;
  let fixture: ComponentFixture<AdminListUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
