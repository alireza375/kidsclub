<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LangResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if(is_null($this->translations)){
            return [
            'id' => "$this->id",
            'name' => $this->name,
            'code' => $this->code,
            'flag' => $this->flag,
            'rtl' => $this->rtl == 1 ? true : false,
            'active' => $this->active == 1 ? true : false,
            'default' => $this->default == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
        }else{
            return [
                'id' => $this->id,
                'name' => $this->name,
                'code' => $this->code,
                'flag' => $this->flag,
                'rtl' => $this->rtl == 1 ? true : false,
                'active' => $this->active == 1 ? true : false,
                'default' => $this->default == 1 ? true : false,
                'translations' => json_decode($this->translations)
            ];
        }
    }
}
