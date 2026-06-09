<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\DTOs\CategoryDTO;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryDTO::collection(
            Category::with('machines')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        return response()->json(
            CategoryDTO::fromModel(Category::create($data))->toArray(),
            201
        );
    }

    public function show(Category $category)
    {
        return CategoryDTO::fromModel($category->load('machines'))->toArray();
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $category->update($data);

        return CategoryDTO::fromModel($category)->toArray();
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    public function restore(Category $category)
    {
        $category->restore();
        return CategoryDTO::fromModel($category->load('machines'))->toArray();
    }
}
