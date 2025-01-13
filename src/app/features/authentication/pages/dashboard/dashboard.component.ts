// import {
//   Component,
//   OnInit,
//   CUSTOM_ELEMENTS_SCHEMA,
//   inject,
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { MessageComponent } from './message/message.component';
// import { SendMessageCardComponent } from './send-message-card/send-message-card.component';
// import { Message } from '~core/types/message.type';
// import { MessageService } from '~features/authentication/services/message.service';

// @Component({
//   selector: 'app-messages-page',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
//   imports: [MessageComponent, SendMessageCardComponent],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class MessagesPageComponent implements OnInit {
//   private readonly messageService = inject(MessageService);
//   private readonly changeDetectorRef = inject(ChangeDetectorRef);

//   messages: Message[] = [];
//   totalMessages = 0;
//   currentPage = 1;
//   pageSize = 5;

//   ngOnInit() {
//     this.loadMessages();
//   }

//   loadMessages() {
//     this.messageService.getMessages(this.currentPage, this.pageSize).subscribe({
//       next: (response) => {
//         this.messages = response.messages;
//         this.totalMessages = response.total || 100;
//         this.changeDetectorRef.markForCheck();
//       },
//       error: (error) => {
//         console.error('Failed to fetch messages', error);
//       },
//     });
//   }

//   goToPage(page: number) {
//     this.currentPage = page;
//     this.loadMessages();
//   }
// }

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
import { PubNubService } from '~features/authentication/services/pubnub.service';
import { v4 as uuidv4 } from 'uuid';

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
  private readonly pubNubService = inject(PubNubService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  messages: Message[] = [];
  totalMessages = 0;
  currentPage = 1;
  pageSize = 5;

  ngOnInit() {
    this.loadMessages();
    this.subscribeToPubNub();
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

  subscribeToPubNub() {
    this.pubNubService.onMessage().subscribe(({ message }) => {
      this.updateMessages(message);
    });
  }

  // updateMessages(message: Message) {
  //   const existingMessageIndex = this.messages.findIndex((m) => m.sid === message.sid);
  //   if (existingMessageIndex > -1) {
  //     // Update the status of the existing message
  //     this.messages[existingMessageIndex].status = message.status;
  //   } else {
  //     // Add a new message (mock data for missing fields)
  //     this.messages.unshift({
  //       id: message.id,
  //       sid: message.sid,
  //       content: message.content,
  //       recipient_phone: message.recipient_phone,
  //       sent_at: message.sent_at,
  //       status: message.status,
  //     });
  //   }
  //   this.changeDetectorRef.markForCheck();
  // }
  updateMessages(message: Message) {
    const existingMessageIndex = this.messages.findIndex((m) => m.sid === message.sid);

    if (existingMessageIndex > -1) {
      // Found the existing message
      const existingMessage = this.messages[existingMessageIndex];

      // Only update if the incoming status is a progression
      if (this.isStatusProgression(existingMessage.status, message.status)) {
        existingMessage.status = message.status;
        this.changeDetectorRef.markForCheck();
      } else {
        console.log(
          `Ignored status update for ${message.sid}: ${message.status} -> ${existingMessage.status}`,
        );
      }
    } else {
      // Add a new message (mock data for missing fields)
      this.messages.unshift({
        id: message.id,
        sid: message.sid,
        content: message.content || 'New Message', // Default content if missing
        recipient_phone: message.recipient_phone || 'Unknown', // Default phone if missing
        sent_at: message.sent_at || new Date(), // Default to current time if missing
        status: message.status,
      });
      this.changeDetectorRef.markForCheck();
    }
  }

  // Helper function to check if the status update is valid
  private isStatusProgression(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['sent', 'delivered']; // Define the order of progression
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    // Allow updates only if the new status is later in the progression
    return newIndex > currentIndex;
  }
}
