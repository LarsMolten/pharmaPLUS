<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;

class StorearticleRequest extends FormRequest
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
            // 'id_article' => 'nullable|integer',
            'designation' => 'required|string|max:255',
            'presentation' => 'required|string|max:255',
            'unite' => 'required|exists:unites,id',
            'stock' => 'integer|min:0',
            'statut' => 'integer|max:1',
            'etat' => 'integer|max:1',
        ];
    }
}
