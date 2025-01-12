import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '~core/components/header/header.component';
import { FooterComponent } from '~core/components/footer/footer.component';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class AppComponent implements OnInit {
  ngOnInit() {}
}
