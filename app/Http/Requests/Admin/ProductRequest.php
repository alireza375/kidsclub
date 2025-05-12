<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiValidationTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
        return [
            //
            'name' => 'required',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required:numeric|min:0',
            'short_description' => 'required',
            'category' => 'required',
            'description' => 'required',
            'thumbnail_image' =>'required',
            'images' => 'required',
            'discount' => 'nullable',
            'discount_type' => 'nullable',
            'discount_price' => 'nullable'
        ];
    }
}
