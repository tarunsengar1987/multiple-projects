import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectForecastComponent } from './project-forecast.component';

describe('ProjectForecastComponent', () => {
  let component: ProjectForecastComponent;
  let fixture: ComponentFixture<ProjectForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectForecastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
