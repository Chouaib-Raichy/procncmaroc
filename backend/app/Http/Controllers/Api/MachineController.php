<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MachineController extends Controller
{
    public function index()
    {
        $query = Machine::where('visible', true)
            ->with('category')
            ->orderBy('created_at', 'desc');

        if (request('all')) {
            return $query->get();
        }

        return $query->paginate(request('per_page', 9));
    }

    public function all()
    {
        return Machine::with('category')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'nullable|image|max:51200',
            'visible'     => 'boolean',
            'category_id' => 'nullable|exists:categories,id',
            'price'       => 'nullable|numeric|min:0',
            'pdf'         => 'nullable|file|mimes:pdf|max:10240',
            'features'    => 'nullable|json',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('machines', 'public');
        }

        if ($request->hasFile('pdf')) {
            $data['pdf'] = $request->file('pdf')->store('machines/pdfs', 'public');
        }

        if ($request->filled('features')) {
            $data['features'] = json_decode($request->features);
        }

        $machine = Machine::create($data);

        return response()->json($machine->load('category'), 201);
    }

    public function show(Machine $machine)
    {
        return $machine->load('category');
    }

    public function showPublic(Machine $machine)
    {
        abort_if(!$machine->visible, 404);
        return $machine->load('category');
    }

    public function update(Request $request, Machine $machine)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image'       => 'nullable|image|max:51200',
            'visible'     => 'boolean',
            'category_id' => 'nullable|exists:categories,id',
            'price'       => 'nullable|numeric|min:0',
            'pdf'         => 'nullable|file|mimes:pdf|max:10240',
            'features'    => 'nullable|json',
        ]);

        if ($request->hasFile('image')) {
            if ($machine->image) {
                Storage::disk('public')->delete($machine->image);
            }
            $data['image'] = $request->file('image')->store('machines', 'public');
        }

        if ($request->hasFile('pdf')) {
            if ($machine->pdf) {
                Storage::disk('public')->delete($machine->pdf);
            }
            $data['pdf'] = $request->file('pdf')->store('machines/pdfs', 'public');
        }

        if ($request->filled('features')) {
            $data['features'] = json_decode($request->features);
        }

        $machine->update($data);

        return response()->json($machine->load('category'));
    }

    public function destroy(Machine $machine)
    {
        if ($machine->image) {
            Storage::disk('public')->delete($machine->image);
        }
        if ($machine->pdf) {
            Storage::disk('public')->delete($machine->pdf);
        }
        $machine->delete();

        return response()->json(['message' => 'Machine deleted']);
    }
}
