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

    this.pubnub.addListener({
      message: (event) => {
        console.log(`Received message on channel ${event.channel}:`, event.message);
        this.messageSubject.next({ channel: event.channel, message: event.message });
      },
    });
  }

  subscribe(channel: string): void {
    this.pubnub.subscribe({ channels: [channel] });
    console.log(`Subscribed to channel: ${channel}`);
  }

  unsubscribe(channel: string): void {
    this.pubnub.unsubscribe({ channels: [channel] });
    console.log(`Unsubscribed from channel: ${channel}`);
  }

  onMessage(): Observable<{ channel: string; message: any }> {
    return this.messageSubject.asObservable();
  }
}
