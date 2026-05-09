<?php
// app/Mail/ShortlistedMail.php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class ShortlistedMail extends Mailable
{
  use Queueable, SerializesModels;

    /* =========================================================
     | PUBLIC PROPERTIES
     |========================================================= */

  /**
   * Application instance
   */
  public Application $application;

  /**
   * Custom email message
   */
  public string $customMessage;

  /**
   * Email subject
   */
  public string $subject;

    /* =========================================================
     | CONSTRUCTOR
     |========================================================= */

  /**
   * Create a new mail instance.
   */
  public function __construct(
    Application $application,
    string $subject,
    string $customMessage
  ) {
    $this->application = $application;
    $this->subject = $subject;
    $this->customMessage = $customMessage;
  }

    /* =========================================================
     | MAIL ENVELOPE
     |========================================================= */

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: $this->subject,
    );
  }

    /* =========================================================
     | MAIL CONTENT
     |========================================================= */

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'emails.shortlisted',
    );
  }

    /* =========================================================
     | MAIL HEADERS
     |========================================================= */

  /**
   * Get custom email headers.
   */
  public function headers(): Headers
  {
    return new Headers(
      text: [
        'X-Priority' => '1',
        'X-Mailer' => 'JobMatch Application System',
        'List-Unsubscribe' => '<mailto:unsubscribe@jobmatch.com>',
      ],
    );
  }

    /* =========================================================
     | ATTACHMENTS
     |========================================================= */

  /**
   * Get mail attachments.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
