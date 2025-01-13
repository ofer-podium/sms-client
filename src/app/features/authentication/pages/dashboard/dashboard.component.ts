import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { SendMessageFormComponent } from './send-message-form/send-message-form.component';
import { Message } from '~core/types/message.type';
import { MessageService } from '~features/authentication/services/message.service';
import { PubNubService } from '~features/authentication/services/pubnub.service';
import { AuthenticationService } from '~features/authentication/services/authentication.service';

@Component({
  selector: 'app-messages-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MessageComponent, SendMessageFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MessagesPageComponent implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly pubNubService = inject(PubNubService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  messages: Message[] = [];
  totalMessages = 0;
  page = 1;
  limit = 5;

  ngOnInit() {
    this.clearPagination();
    this.subscribeToChannel();
    this.loadMessages();
    this.listenToMessages();
  }

  clearPagination() {
    this.totalMessages = 0;
    this.page = 1;
    this.limit = 5;
  }

  loadMessages() {
    this.messageService.getMessages(this.page, this.limit).subscribe({
      next: (response) => {
        this.messages = response.messages;
        this.totalMessages = response.total;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Failed to fetch messages', error);
      },
    });
  }

  loadMoreMessages() {
    if (this.messages.length >= this.totalMessages) {
      console.log('No more messages to load.');
      return;
    }

    this.page++; // Increment the page number
    this.messageService.getMessages(this.page, this.limit).subscribe({
      next: (response) => {
        this.messages = [...this.messages, ...response.messages]; // Append new messages
        this.totalMessages = response.total;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Failed to fetch more messages', error);
      },
    });
  }

  private subscribeToChannel() {
    const channel = this.authService.getUserChannel();
    if (channel) {
      this.pubNubService.subscribe(channel);
    } else {
      console.error('No channel found for the user.');
    }
  }

  private listenToMessages() {
    this.pubNubService.onMessage().subscribe(({ message }) => {
      this.updateMessages(message);
    });
  }

  private updateMessages(message: Message): void {
    const existingMessage = this.messages.find((m) => m.sid === message.sid);

    if (existingMessage && this.isStatusProgression(existingMessage.status, message.status)) {
      existingMessage.status = message.status;
      this.changeDetectorRef.markForCheck();
      return;
    }

    if (!existingMessage) {
      this.totalMessages++;
      this.messages.unshift({
        id: message.id,
        sid: message.sid,
        content: message.content,
        recipient_phone: message.recipient_phone,
        sent_at: message.sent_at,
        status: message.status,
      });
      this.changeDetectorRef.markForCheck();
    } else {
      console.log(
        `Ignored status update for ${message.sid}: ${message.status} -> ${existingMessage.status}`,
      );
    }
  }

  private isStatusProgression(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['sent', 'delivered']; // Define the order of progression
    return statusOrder.indexOf(newStatus) > statusOrder.indexOf(currentStatus);
  }
}
