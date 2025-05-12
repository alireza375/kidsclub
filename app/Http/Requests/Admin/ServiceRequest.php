<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiValidationTrait;
use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
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
        if ($this->id) {
            return [

            ];
        } else {
            return [
                'title' => 'required',
                'description' => 'required',
                'image' => 'required',
                'instructor_id' => 'nullable',
                'price' => 'required',
                'discount' => 'nullable',
                'discount_type' => 'nullable',
                'category' => 'nullable',
                'session' => 'nullable|string|max:255',
                'duration' => 'nullable|string|max:255',
                'capacity' => 'nullable|integer|min:0',
                'service_news' => 'nullable|array',
                'is_active' => 'nullable|boolean',

            ];
        }
    }
}
