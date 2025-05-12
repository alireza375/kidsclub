<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;



trait ApiValidationTrait
{
    protected function failedValidation(Validator $validator)
    {
        $errors = [];
        if ($validator->fails()) {
            $e = $validator->errors()->all();
            foreach ($e as $error) {
                $errors[] = $error;
            }
        }
        $json = [
            'status'  => 422,
            'success' => FALSE,
            'message' => $errors[0],
            'data'    => []
        ];
        $response = new JsonResponse($json, 422);

        throw (new ValidationException($validator, $response))->errorBag($this->errorBag)->redirectTo($this->getRedirectUrl());
    }
}
