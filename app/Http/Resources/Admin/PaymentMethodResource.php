<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Env;

class PaymentMethodResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = [
             'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'config' => json_decode($this->config,true),
            'image' => $this->image,
            'status' => $this->status == 1 ? true : false
        ];
         if(Env::get('DEMO_MODE') == true){
            $data['config'] = [
                'mode' => 'sandbox',
                'clientId' => "***********",
                'clientSecret' => "***********"
            ];
        }

        return $data;
    }
}
