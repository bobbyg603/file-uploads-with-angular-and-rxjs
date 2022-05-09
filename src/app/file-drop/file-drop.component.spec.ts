import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDrop } from './file-drop.component';

describe('FileDrop', () => {
  let component: FileDrop;
  let fixture: ComponentFixture<FileDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDrop ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDrop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
