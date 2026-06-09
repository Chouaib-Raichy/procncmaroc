<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use App\DTOs\MachineDTO;
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
            return MachineDTO::collection($query->get());
        }

        $paginator = $query->paginate(request('per_page', 9));
        return MachineDTO::paginated($paginator);
    }

    public function all()
    {
        return MachineDTO::collection(
            Machine::with('category')->orderBy('created_at', 'desc')->get()
        );
    }

    public function trashed()
    {
        return MachineDTO::collection(
            Machine::onlyTrashed()->with('category')->orderBy('created_at', 'desc')->get()
        );
    }

    public function restore(Machine $machine)
    {
        $machine->restore();
        return MachineDTO::fromModel($machine->load('category'))->toArray();
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

        return response()->json(
            MachineDTO::fromModel($machine->load('category'))->toArray(),
            201
        );
    }

    public function show(Machine $machine)
    {
        return MachineDTO::fromModel($machine->load('category'))->toArray();
    }

    public function showPublic(Machine $machine)
    {
        abort_if(!$machine->visible, 404);
        return MachineDTO::fromModel($machine->load('category'))->toArray();
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

        return MachineDTO::fromModel($machine->load('category'))->toArray();
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
