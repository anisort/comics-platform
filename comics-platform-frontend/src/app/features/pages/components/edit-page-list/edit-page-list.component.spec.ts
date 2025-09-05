import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPageListComponent } from './edit-page-list.component';

describe('EditPageListComponent', () => {
  let component: EditPageListComponent;
  let fixture: ComponentFixture<EditPageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
