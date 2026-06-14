<?php

namespace App\DTOs;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly ?float $price,
        public readonly ?array $images_url,
        public readonly bool $visible,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $product = $model instanceof Product ? $model : Product::findOrFail($model->id);

        return new self(
            id: $product->id,
            title: $product->title,
            description: $product->description,
            price: $product->price !== null ? (float) $product->price : null,
            images_url: $product->images_url,
            visible: $product->visible,
            created_at: $product->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'price'       => $this->price,
            'images_url'  => $this->images_url,
            'visible'     => $this->visible,
            'created_at'  => $this->created_at,
        ];
    }
}
