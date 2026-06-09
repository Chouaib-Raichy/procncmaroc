<?php

namespace App\DTOs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class DTO
{
    abstract public function toArray(): array;

    public static function collection($models): array
    {
        return array_map(fn($m) => static::fromModel($m)->toArray(), iterator_to_array($models));
    }

    public static function paginated(LengthAwarePaginator $paginator): array
    {
        $data = array_map(fn($m) => static::fromModel($m)->toArray(), iterator_to_array($paginator->items()));

        return [
            'data' => $data,
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ];
    }

    abstract public static function fromModel(Model $model): self;
}
