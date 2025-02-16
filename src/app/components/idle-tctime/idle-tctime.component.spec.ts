import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTCtimeComponent } from './idle-tctime.component';

describe('IdleTCtimeComponent', () => {
  let component: IdleTCtimeComponent;
  let fixture: ComponentFixture<IdleTCtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleTCtimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdleTCtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
