import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-error-404',
  templateUrl: './error-404.component.html',
  styleUrl: 'error-404.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component {}
