<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiValidationTrait;
use Illuminate\Foundation\Http\FormRequest;

class CouponRequest extends FormRequest
{
    use ApiValidationTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if($this->id) {
            return [

            ];
        }else{
            return [
            'name' => 'required',
            'code' => 'required',
            'discount' => 'required',
            'type' => 'required',
            'usage_limit_per_user' => 'required',
            'minimum_order_amount' => 'required',
            'expire_at' => 'required',
            'status' => 'required'
        ];
        }
    }
}
