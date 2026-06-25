<?php

namespace App\DTOs;

use App\Models\Machine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MachineDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly ?string $image_url,
        public readonly bool $visible,
        public readonly ?int $category_id,
        public readonly ?float $price,
        public readonly ?string $pdf_url,
        public readonly ?array $features,
        public readonly ?CategoryDTO $category,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $machine = $model instanceof Machine ? $model : Machine::with('category')->findOrFail($model->id);

        return new self(
            id: $machine->id,
            title: $machine->title,
            description: $machine->description,
            image_url: $machine->image ? url('storage/' . $machine->image) : null,
            visible: $machine->visible,
            category_id: $machine->category_id,
            price: $machine->price !== null ? (float) $machine->price : null,
            pdf_url: $machine->pdf ? url('storage/' . $machine->pdf) : null,
            features: $machine->features,
            category: $machine->relationLoaded('category') && $machine->category
                ? CategoryDTO::fromModel($machine->category)
                : null,
            created_at: $machine->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'visible' => $this->visible,
            'category_id' => $this->category_id,
            'price' => $this->price,
            'pdf_url' => $this->pdf_url,
            'features' => $this->features,
            'category' => $this->category?->toArray(),
            'created_at' => $this->created_at,
        ];
    }
}
