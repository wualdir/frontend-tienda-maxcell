import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListOrdenesComponent } from './admin-list-ordenes.component';

describe('AdminListOrdenesComponent', () => {
  let component: AdminListOrdenesComponent;
  let fixture: ComponentFixture<AdminListOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListOrdenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
