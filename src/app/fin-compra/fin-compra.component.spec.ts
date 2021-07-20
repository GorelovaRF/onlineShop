import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinCompraComponent } from './fin-compra.component';

describe('FinCompraComponent', () => {
  let component: FinCompraComponent;
  let fixture: ComponentFixture<FinCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
