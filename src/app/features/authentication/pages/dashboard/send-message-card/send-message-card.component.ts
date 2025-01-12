import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '~features/authentication/services/message.service';

@Component({
  selector: 'app-send-message-card',
  templateUrl: './send-message-card.component.html',
  styleUrls: ['./send-message-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class SendMessageCardComponent {
  @Input() defaultCountryCode = '+972';
  private readonly messageService = inject(MessageService);

  messageForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      countryCode: new FormControl(this.defaultCountryCode, [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
      messageContent: new FormControl('', [Validators.required, Validators.maxLength(250)]),
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.messageForm.markAllAsTouched();
      const { countryCode, phoneNumber, messageContent } = this.messageForm.value;

      this.messageService.sendMessage(`${countryCode}${phoneNumber}`, messageContent).subscribe({
        next: () => {
          this.messageForm.reset({ countryCode: this.defaultCountryCode });
        },
        error: (error) => {
          console.error('SendMessage Error:', error);
        },
      });
    }
  }
}
