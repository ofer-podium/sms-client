import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '~core/types/message.type';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() message!: Message;

  ngOnChanges() {}
}
