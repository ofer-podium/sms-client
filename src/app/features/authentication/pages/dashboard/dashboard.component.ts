import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { SendMessageCardComponent } from './send-message-card/send-message-card.component';
import { Message } from '~core/types/message.type';
import { MessageService } from '~features/authentication/services/message.service';

@Component({
  selector: 'app-messages-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MessageComponent, SendMessageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessagesPageComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  messages: Message[] = [];
  totalMessages = 0;
  currentPage = 1;
  pageSize = 5;

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.messages = response.messages;
        this.totalMessages = response.total || 100;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Failed to fetch messages', error);
      },
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadMessages();
  }
}
