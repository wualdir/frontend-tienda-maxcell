import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminByUserComponent } from './admin-by-user.component';

describe('AdminByUserComponent', () => {
  let component: AdminByUserComponent;
  let fixture: ComponentFixture<AdminByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminByUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
