<?php

namespace App\Http\Requests\EntreeDetail;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntreeDetailRequest extends FormRequest
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
            'entree_indices_id' => 'required|integer',
            'article_id' => 'required|integer',
            'lot' => 'required|string|max:255',
            'qte_initial' => 'required|integer|min:0',
            'qte_entree' => 'required|integer|min:0',
            'stock_restant_lot' => 'integer|min:0',
            'stock_dispo' => 'integer|min:0',
            'prix_achat_boite' => 'required|numeric|min:0',
            'prix_unitaire' => 'numeric|min:0',
            'pu_proposee' => 'numeric|min:0',
            'montant_entree' => 'numeric|min:0',
            'montant_gain_brut' => 'numeric|min:0',
            'montant_gain_proposee' => 'numeric|min:0',
            'nb_lot_dispo' => 'integer|max:1',
            'date_peremption' => 'date|date_format:mm-yyyy',
            'isValide' => 'boolean|max:1',
            'isVendus' => 'boolean|max:1',
            'etat' => 'boolean|max:1',
        ];
    }
}
