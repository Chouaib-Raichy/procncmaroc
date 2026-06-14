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
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
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
            'description' => 'nullable|string',
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
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'images'      => 'nullable|array|max:3',
            'images.*'    => 'image|max:10240',
            'visible'     => 'boolean',
        ]);

        if ($request->hasFile('images')) {
            if ($product->images) {
                foreach ($product->images as $old) {
                    Storage::disk('public')->delete($old);
                }
            }
            $paths = [];
            foreach ($request->file('images') as $img) {
                $paths[] = $img->store('products', 'public');
            }
            $data['images'] = $paths;
        }

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
        return ProductDTO::collection(
            Product::withTrashed()->orderBy('created_at', 'desc')->get()
        );
    }
}
