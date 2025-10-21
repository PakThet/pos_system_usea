<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Filter by shift
            if ($request->has('shift')) {
                $query->where('shift', $request->shift);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                "success" => true,
                "message" => "Users fetched successfully",
                "data" => $users,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'employee_id' => 'required|string|unique:users',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'phone' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'status' => 'required|in:active,inactive',
                'role' => 'required|in:cashier,manager,admin',
                'shift' => 'required|in:morning,evening,night',
                'hourly_rate' => 'required|numeric|min:0',
                'permissions' => 'nullable|array',
                'password' => 'required|string|min:8',
            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $validated['avatar'] = $this->storeImage($request->file('avatar'), 'avatars');
            }

            $validated['password'] = Hash::make($validated['password']);
            
            $user = User::create($validated);

            // Convert avatar path to full URL
            if ($user->avatar) {
                $user->avatar = $this->getImageUrl($user->avatar);
            }

            return response()->json([
                "success" => true,
                "message" => "User created successfully",
                "data" => $user,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(User $user)
    {
        try {
            // Convert avatar path to full URL
            if ($user->avatar) {
                $user->avatar = $this->getImageUrl($user->avatar);
            }

            return response()->json([
                "success" => true,
                "message" => "User fetched successfully",
                "data" => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'employee_id' => 'sometimes|string|unique:users,employee_id,' . $user->id,
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'phone' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'status' => 'sometimes|in:active,inactive',
                'role' => 'sometimes|in:cashier,manager,admin',
                'shift' => 'sometimes|in:morning,evening,night',
                'hourly_rate' => 'sometimes|numeric|min:0',
                'permissions' => 'nullable|array',
                'password' => 'sometimes|string|min:8',
            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($user->avatar) {
                    $this->deleteImage($user->avatar);
                }
                $validated['avatar'] = $this->storeImage($request->file('avatar'), 'avatars');
            }

            // Hash password if provided
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $user->update($validated);

            // Convert avatar path to full URL
            if ($user->avatar) {
                $user->avatar = $this->getImageUrl($user->avatar);
            }

            return response()->json([
                "success" => true,
                "message" => "User updated successfully",
                "data" => $user,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        try {
            // Delete associated avatar
            if ($user->avatar) {
                $this->deleteImage($user->avatar);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'total_sales' => User::sum('total_sales'),
                'total_transactions' => User::sum('total_transactions'),
                'average_transaction' => User::where('total_transactions', '>', 0)
                    ->avg('total_sales') / max(User::avg('total_transactions'), 1),
            ];

            return response()->json([
                "success" => true,
                "message" => "User stats fetched successfully",
                "data" => $stats,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function storeImage($image, $folder = 'avatars')
    {
        return $image->store($folder, 'public');
    }

    private function getImageUrl($path)
    {
        return asset('storage/' . $path);
    }

    private function deleteImage($path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}