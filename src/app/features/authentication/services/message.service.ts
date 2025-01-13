import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '~environments/environment';
import { map } from 'rxjs';
import { Message } from '../../../core/types/message.type';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  sendMessage(phoneNumber: string, messageContent: string): Observable<void> {
    const sendMessageEndpoint = `${this.apiUrl}/api/messages/send_message`;

    return this.httpClient
      .post<{ success: boolean }>(sendMessageEndpoint, {
        recipient_phone: phoneNumber.trim(),
        content: messageContent.trim(),
      })
      .pipe(
        map((response: any) => {
          const { data } = response;
          return data;
        }),
      );
  }

  getMessages(page: number, limit: number): Observable<{ messages: Message[]; total: number }> {
    const getMessagesEndpoint = `${this.apiUrl}/api/messages/user_messages`;
    return this.httpClient.get<{ messages: Message[]; total: number }>(getMessagesEndpoint, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }
}
