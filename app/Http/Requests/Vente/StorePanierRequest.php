<?php

namespace App\Http\Requests\Vente;

use Illuminate\Foundation\Http\FormRequest;

class StorePanierRequest extends FormRequest
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
            'type_vente' => 'string|nullable',
            'id_panier' => 'integer|nullable',
            'entree_detail_id' => 'integer|nullable',
            'article_id' => 'integer|nullable',
            'analyse_id' => 'array|nullable',
            'service_id' => 'integer|nullable',
            'consultation_id' => 'integer|nullable',
            'kit_id' => 'integer|nullable',
            'nom_patient' => 'string|nullable',
            'sex_patient' => 'boolean',
            'age_patient' => 'integer|nullable',
            'unite_age' => 'boolean',
            'type_doctuer' => 'string|nullable',
            'docteur' => 'string|nullable',
            'p_u_brut' => 'numeric|min:0',
            'p_u_proposee' => 'numeric|min:0',
            'qte' => 'integer|min:0',
            'montant_brut' => 'numeric|min:0',
            'montant_proposee' => 'numeric|min:0',
            'montant_ecart' => 'numeric|min:0',
            'user_id' => 'integer'
        ];
    }
}
