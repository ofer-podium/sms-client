// import { Injectable } from '@angular/core';
// import PubNub from 'pubnub';
// import { environment } from '~environments/environment';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable({
//   providedIn: 'root',
// })
// export class PubNubService {
//   private pubnub: PubNub;

//   constructor() {
//     this.pubnub = new PubNub({
//       subscribeKey: environment.pubnub.pubnubSubscribeKey,
//       uuid: uuidv4(),
//     });

//     // Add a global listener for incoming messages
//     this.pubnub.addListener({
//       message: (event) => {
//         console.log(`Received message on channel ${event.channel}:`, event.message);
//         this.handleMessage(event.channel, event.message);
//       },
//     });
//   }

//   // Subscribe the user to their specific channel
//   subscribe(channel: string): void {
//     this.pubnub.subscribe({ channels: [channel] });
//     console.log(`Subscribed to channel: ${channel}`);
//   }

//   // Unsubscribe from a specific channel
//   unsubscribe(channel: string): void {
//     this.pubnub.unsubscribe({ channels: [channel] });
//     console.log(`Unsubscribed from channel: ${channel}`);
//   }

//   // Handle incoming messages globally
//   private handleMessage(channel: string, message: any): void {
//     // Log the message (you can extend this logic to update the UI, notify the user, etc.)
//     console.log(`Handling message from channel ${channel}:`, message);
//   }
// }

import { Injectable } from '@angular/core';
import PubNub from 'pubnub';
import { environment } from '~environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubNubService {
  private pubnub: PubNub;
  private messageSubject = new Subject<{ channel: string; message: any }>();

  constructor() {
    this.pubnub = new PubNub({
      subscribeKey: environment.pubnub.pubnubSubscribeKey,
      uuid: uuidv4(),
    });

    // Add a global listener for incoming messages
    this.pubnub.addListener({
      message: (event) => {
        console.log(`In the pubnub - Received message on channel ${event.channel}:`, event.message);
        this.messageSubject.next({ channel: event.channel, message: event.message });
      },
    });
  }

  // Subscribe the user to their specific channel
  subscribe(channel: string): void {
    this.pubnub.subscribe({ channels: [channel] });
    console.log(`Subscribed to channel: ${channel}`);
  }

  // Unsubscribe from a specific channel
  unsubscribe(channel: string): void {
    this.pubnub.unsubscribe({ channels: [channel] });
    console.log(`Unsubscribed from channel: ${channel}`);
  }

  // Observable to get incoming messages
  onMessage(): Observable<{ channel: string; message: any }> {
    return this.messageSubject.asObservable();
  }
}
