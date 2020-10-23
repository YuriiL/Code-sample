import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterW2Component } from './register-w2.component';

describe('RegisterW2Component', () => {
  let component: RegisterW2Component;
  let fixture: ComponentFixture<RegisterW2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterW2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterW2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
