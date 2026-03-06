<?php

namespace App\Http\Requests\DetailKit;

use Illuminate\Foundation\Http\FormRequest;

class StoreDetailKitRequest extends FormRequest
{
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
            'id_kit' => 'required',
            'id_article' => 'required',
            'qte_kit' => 'integer|min:0',
            'etat' => 'integer|max:1',
        ];
    }
}
