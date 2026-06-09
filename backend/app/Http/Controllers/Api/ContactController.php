<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\DTOs\ContactDTO;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'message'    => 'required|string',
        ]);

        $contact = Contact::create($request->only('first_name', 'last_name', 'email', 'message'));

        return response()->json([
            'message' => 'Message sent successfully',
            'contact' => ContactDTO::fromModel($contact)->toArray(),
        ], 201);
    }

    public function index()
    {
        return ContactDTO::collection(
            Contact::orderBy('created_at', 'desc')->get()
        );
    }

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}
