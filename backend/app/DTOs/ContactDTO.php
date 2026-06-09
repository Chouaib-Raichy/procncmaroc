<?php

namespace App\DTOs;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Model;

class ContactDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $first_name,
        public readonly string $last_name,
        public readonly string $email,
        public readonly string $message,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $contact = $model instanceof Contact ? $model : Contact::findOrFail($model->id);

        return new self(
            id: $contact->id,
            first_name: $contact->first_name,
            last_name: $contact->last_name,
            email: $contact->email,
            message: $contact->message,
            created_at: $contact->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'message' => $this->message,
            'created_at' => $this->created_at,
        ];
    }
}
