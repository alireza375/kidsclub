<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiValidationTrait;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
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
   if($this->id){
    return[

    ];
   }else{
    return [
        'title' => 'required|array', // Expecting a JSON object for multiple languages
        'image' => 'required',
        'type' => 'required',
        'description' => 'required|array', // Expecting a JSON object for multiple languages
        'event_date' => 'required|date', // Mandatory, must be a valid date
        'start_time' => 'required', // Must be a valid time
        'end_time' => 'required|after:start_time', // End time must be after start time
        'members' => 'nullable|array',
        'location' => 'required|string|max:255', // Mandatory, max length
        'price' => 'nullable|numeric|min:0', // Optional, must be a positive number
        'event_category' => 'nullable|array', // Optional, must be an array
    ];
   }

}

}
