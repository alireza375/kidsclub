<?php

namespace App\Http\Resources\Common;

use App\Models\Children;
use App\Models\Currency;
use App\Models\Pakage;
use App\Models\User_Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $allCurrency = Currency::get();

        $children = Children::where('user_id', $this->id)->get();

        return [
            'id' => $this->id,
            'uid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role == USER ? 'user' : ($this->role == COACH ? 'coach' : 'admin'),
            'image' => $this->image,
            'address' => json_decode($this->address) ?? null,
            'about' => $this->about,
            'date_of_birth' => $this->date_of_birth,
            'facebook' => $this->facebook,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin,
            'instagram' => $this->instagram,
            'description' => $this->description,
            'education' => $this->education,
            'experience' => $this->experience,
            'skill' => $this->skill,
            'achievement' => $this->achievement,
            'philosophy' => $this->philosophy,
            'children' => [
                'total' => $children->count(),
                'data' => $children
            ],
            'status' => $this->status == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
    private function getCurrencySymbol($allCurrency, $currency)
    {
        foreach ($allCurrency as $curr) {
            if ($curr->code == $currency) {
                return $curr->symbol;
            }
        }
    }
}
