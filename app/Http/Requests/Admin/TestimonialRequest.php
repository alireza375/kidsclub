<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiValidationTrait;
use Illuminate\Foundation\Http\FormRequest;

class TestimonialRequest extends FormRequest
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
            //
        if($this->id){
            return [
                'name' => 'required',
                'description' => 'required',
                'rating' => 'required|integer|min:1|max:5',
            ];
        } 
        return [
            'name' => 'required',
            'description' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'required',
        ];
    }
}
