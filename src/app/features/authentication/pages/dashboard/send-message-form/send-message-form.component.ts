import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '~features/authentication/services/message.service';

@Component({
  selector: 'app-send-message-form',
  templateUrl: './send-message-form.component.html',
  styleUrls: ['./send-message-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SendMessageFormComponent {
  @Input() defaultCountryCode = '+972';
  private readonly messageService = inject(MessageService);

  messageForm: FormGroup;
  isSubmitting = false;

  get remainingChars(): number {
    const contentControl = this.messageForm.get('messageContent');
    return contentControl ? 250 - (contentControl.value?.length || 0) : 250;
  }

  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      countryCode: new FormControl(this.defaultCountryCode, [Validators.required]),
      phoneNumber: new FormControl('526305081', [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]),
      messageContent: new FormControl('', [Validators.required, Validators.maxLength(250)]),
    });
  }

  enforceMaxLength(): void {
    const contentControl = this.messageForm.get('messageContent');
    if (contentControl && contentControl.value.length > 250) {
      contentControl.setValue(contentControl.value.substring(0, 250));
    }
  }

  handleEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.messageForm.valid) {
        this.sendMessage(); // Submit the form
      }
    }
  }

  sendMessage() {
    if (this.messageForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Prevent further submissions
      this.messageForm.markAllAsTouched();
      const { countryCode, phoneNumber, messageContent } = this.messageForm.value;

      this.messageService.sendMessage(`${countryCode}${phoneNumber}`, messageContent).subscribe({
        next: () => {
          this.messageForm.reset({
            countryCode: this.defaultCountryCode,
            phoneNumber: '526305081',
          });
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('SendMessage Error:', error);
          this.isSubmitting = false;
        },
      });
    }
  }
}
