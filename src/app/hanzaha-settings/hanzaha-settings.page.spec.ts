import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HanzahaSettingsPage } from './hanzaha-settings.page';

describe('HanzahaSettingsPage', () => {
  let component: HanzahaSettingsPage;
  let fixture: ComponentFixture<HanzahaSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HanzahaSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HanzahaSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
