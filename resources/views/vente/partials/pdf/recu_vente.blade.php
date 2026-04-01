<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 1px;
        }


        body {
            font-family: DejaVu Sans, monospace;
            font-size: 11px;
            width: 72mm;
            margin: 1;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }

        .big {
            font-size: 14px;
        }

        hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 6px 0;
        }

        /* header */

        .header {
            display: flex;
            align-items: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }

        .header .logo {
            width: 60px;
            /* largeur max logo */
            margin-right: 10px;
        }

        .header .logo img {
            width: 55px;
            height: auto;
        }

        .header .company {
            flex: 1;
            text-align: left;
            font-size: 11px;
        }

        /* .header .company h2 {
            margin: 0;
            font-size: 16px;
        } */

        .logo {
            width: 60px;
        }

        .logo img {
            width: 45px;
        }

        .company {
            flex: 1;
            font-size: 11px;
        }

        .company h2 {
            margin: 0;
            font-size: 15px;
        }

        */
        /* table articles */

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            border-bottom: 1px dashed #000;
        }

        td {
            padding: 2px 0;
        }
    </style>

</head>

<body>

    <!-- HEADER -->

    <table style="width:100%; margin-bottom:5px;">
        <tr>
            <!-- Colonne logo -->
            <td style="width:60px;">
                <img src="{{ public_path('logo/logo.png') }}" style="width:55px;" alt="logo">
            </td>
            <!-- Colonne infos société -->
            <td style="text-align:left; font-size:11px;">
                <h2 style="margin:0; font-size:16px;">OMIT</h2>
                BETELA BP-187 Toliara<br>
                Tel : +261 34 18 250 90<br>
                E-Mail : omit@moov.mg
            </td>
        </tr>
    </table>

    <hr>

    <!-- INFO VENTE -->

    <table>

        <tr>
            <td>Ticket :</td>
            <td class="right">{{ $vente->reference_vente }}</td>
        </tr>

        <tr>
            <td>Date :</td>
            <td class="right">{{ date('d-m-Y') }}  {{ date('H:i') }}</td>
            {{-- {{ $vente->created_at->format('d-m-Y H:i') }} --}}
        </tr>

        <tr>
            <td>Caissier :</td>
            <td class="right">{{ $vente->user->name ?? '' }}</td>
        </tr>

    </table>

    <hr>

    <!-- ARTICLES -->

    <table>

        <tr class="bold">
            <th>Designation</th>
            <th class="center">Qté</th>
            {{-- <th class="right">Prix</th> --}}
            <th class="right">Total</th>
        </tr>

        @foreach ($vente->details->whereNotNull('article_id') as $d)
            <tr>
                <td>{{ Str::limit($d->article->designation ?? '', 17) ?? '' }}</td>
                <td class="center">{{ $d->qte }}</td>
                {{-- <td class="right">{{ number_format($d->prix_unitaire, 2, '.', ' ') }}</td> --}}
                <td class="right">{{ number_format($d->montant, 2, '.', ' ') }}</td>
            </tr>
        @endforeach

    </table>

    <hr>

    <!-- TOTALS -->

    <table>

        <tr>
            <td>Sous-total</td>
            <td class="right">{{ number_format($sous_total, 2, '.', ' ') }}</td>
        </tr>

        <tr>
            <td>Payé</td>
            <td class="right">{{ number_format($paye, 2, '.', ' ') }}</td>
        </tr>

        <tr>
            <td>Monnaie</td>
            <td class="right">{{ number_format($monnaie, 2, '.', ' ') }}</td>
        </tr>

        <tr class="bold big">
            <td>NET A PAYER</td>
            <td class="right">{{ number_format($net_payer, 2, '.', ' ') }}</td>
        </tr>

    </table>

    <hr>

    <!-- MESSAGE -->

    <div class="center">

        <table>
            <tr>
                <td style="color: white;">________</td>
                <td >{!! DNS1D::getBarcodeHTML($vente->reference_vente, 'C128', 1.4, 40) !!}</td>
                <td style="color: white;">__</td>
            </tr>
        </table>

        Merci pour votre visite



    </div>

</body>

</html>
