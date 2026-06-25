<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\DTOs\ProductDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::where('visible', true)->orderBy('created_at', 'desc');

        if ($search = request('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if (request('all')) {
            return ProductDTO::collection($query->get());
        }

        $paginator = $query->paginate(request('per_page', 9));
        return ProductDTO::paginated($paginator);
    }

    public function show(Product $product)
    {
        abort_if(!$product->visible, 404);
        return ProductDTO::fromModel($product)->toArray();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'price'       => 'nullable|numeric|min:0',
            'images'      => 'nullable|array|max:3',
            'images.*'    => 'image|max:10240',
            'visible'     => 'boolean',
        ]);

        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $img) {
                $paths[] = $img->store('products', 'public');
            }
            $data['images'] = $paths;
        }

        $product = Product::create($data);

        return response()->json(
            ProductDTO::fromModel($product)->toArray(),
            201
        );
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title'          => 'sometimes|string|max:255',
            'price'          => 'nullable|numeric|min:0',
            'images'         => 'nullable|array|max:3',
            'images.*'       => 'image|max:10240',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'string',
            'visible'        => 'sometimes|boolean',
        ]);

        $currentImages = $product->images ?? [];

        if ($request->has('deleted_images')) {
            $toDelete = $request->input('deleted_images');
            foreach ($toDelete as $path) {
                Storage::disk('public')->delete($path);
            }
            $currentImages = array_values(array_diff($currentImages, $toDelete));
        }

        if ($request->hasFile('images')) {
            $newPaths = [];
            foreach ($request->file('images') as $img) {
                $newPaths[] = $img->store('products', 'public');
            }
            $currentImages = array_merge($currentImages, $newPaths);
        }

        $data['images'] = $currentImages;
        $product->update($data);

        return ProductDTO::fromModel($product)->toArray();
    }

    public function destroy(Product $product)
    {
        if ($product->images) {
            foreach ($product->images as $path) {
                Storage::disk('public')->delete($path);
            }
        }
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    public function all()
    {
        $query = Product::orderBy('created_at', 'desc');

        if ($perPage = request('per_page')) {
            $paginator = $query->paginate($perPage);
            return ProductDTO::paginated($paginator);
        }

        return ProductDTO::collection($query->get());
    }
}
