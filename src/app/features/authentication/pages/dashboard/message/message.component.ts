import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '~core/types/message.type';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  imports: [CommonModule],
})
export class MessageComponent {
  @Input() message!: Message;

  getStatusClass(): string {
    return this.message.status.toLowerCase(); // Assumes status is "sent" or "delivered"
  }
}
