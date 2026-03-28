<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $recipientName;
    public string $code;
    public int $expireMinutes;

    /**
     * Create a new message instance.
     */
    public function __construct(string $recipientName, string $code, int $expireMinutes)
    {
        $this->recipientName = $recipientName;
        $this->code = $code;
        $this->expireMinutes = $expireMinutes;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this
            ->subject('Your TravelWorld Password Reset Code')
            ->view('emails.password-reset-code');
    }
}
