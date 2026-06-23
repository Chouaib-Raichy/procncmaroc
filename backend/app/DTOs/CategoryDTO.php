<?php

namespace App\DTOs;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;

class CategoryDTO extends DTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly ?array $machines,
        public readonly int $machines_count,
        public readonly string $created_at,
    ) {}

    public static function fromModel(Model $model): self
    {
        $category = $model instanceof Category ? $model : Category::withCount('machines')->findOrFail($model->id);

        $machines = null;
        if ($category->relationLoaded('machines')) {
            $machines = $category->machines->map(fn($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'image_url' => $m->image ? url('storage/' . $m->image) : null,
                'price' => $m->price !== null ? (float) $m->price : null,
            ])->toArray();
        }

        return new self(
            id: $category->id,
            name: $category->name,
            description: $category->description,
            machines: $machines,
            machines_count: $category->machines_count ?? 0,
            created_at: $category->created_at->toISOString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'machines' => $this->machines,
            'machines_count' => $this->machines_count,
            'created_at' => $this->created_at,
        ];
    }
}
