<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 0px;
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

        .logo {
            width: 60px;
            margin-right: 10px;
        }

        .logo img {
            width: 55px;
            height: auto;
        }

        .company {
            flex: 1;
            font-size: 11px;
        }

        .company h2 {
            margin: 0;
            font-size: 15px;
        }

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

        .page-break {
            page-break-after: always;
        }
    </style>

</head>

<body>


    {{-- ################################################################ RECU CONSULTATION ###################################### --}}
    @if ($vente->details->whereNotNull('consultation_id')->count() > 0)

        @foreach ($Consultation as $ticket)
            <div>
                <!-- ================= HEADER ================= -->
                <table style="width:100%; margin-bottom:5px;">
                    <tr>
                        <td style="width:60px;">
                            <img src="{{ public_path('logo/logo.png') }}" style="width:55px;" alt="logo">
                        </td>
                        <td style="text-align:left; font-size:11px;">
                            <h2 style="margin:0; font-size:16px;">OMIT</h2>
                            TOLIARA Betela BP-187 <br>
                            Tel : +261 34 18 250 90<br>
                            E-Mail : omit@moov.mg
                        </td>
                    </tr>
                </table>

                <hr>

                <!-- ================= INFORMATIONS VENTE ================= -->
                <table>
                    <tr>
                        <td>Ticket :</td>
                        <td class="right">{{ $vente->reference_vente }}</td>
                    </tr>
                    <tr>
                        <td>Date :</td>
                        <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                    </tr>
                    <tr>
                        <td>Caissier :</td>
                        <td class="right">{{ $vente->user->name ?? '' }}</td>
                    </tr>
                </table>
                <hr>

                <!-- ================= CONSULTATIONS ================= -->

                <div class="bold center">
                    CONSULTATION
                </div>
                <hr>

                <table>

                    <tr>
                        <td>Patient</td>
                        <td class="right">{{ $ticket['consultation']->nom_patient }}</td>
                    </tr>

                     {{-- <tr>
                        <td>Genre</td>
                        <td class="right">
                            {{ $ticket['consultation']->sex_patient ? 'Homme' : 'Femme' }}
                        </td>
                    </tr> 

                    <tr>
                        <td>Age</td>
                        <td class="right">
                            {{ $ticket['consultation']->age_patient }}
                            {{ $ticket['consultation']->unite_age ? 'Ans' : 'Mois' }}
                        </td>
                    </tr>  --}}

                    <tr>
                        <td>Docteur</td>
                        <td class="right">{{ $ticket['consultation']->docteurInfo->nom ?? '' }}</td>
                    </tr>

                    <tr>
                        <td>Specialité</td>
                        <td class="right">{{ ucfirst($ticket['consultation']->type_docteur) }}</td>
                    </tr>

                </table>

                <hr>

                <table>

                    <tr>
                        <td>Payé</td>
                        <td class="right">{{ number_format($ticket['paye'], 2, '.', ' ') }}</td>
                    </tr>

                    <tr>
                        <td>Monnaie</td>
                        <td class="right">{{ number_format($ticket['monnaie'], 2, '.', ' ') }}</td>
                    </tr>

                    <tr>
                        <td>NET A PAYER</td>
                        <td class="right">{{ number_format($ticket['montant'], 2, '.', ' ') }}</td>
                    </tr>

                </table>

                <hr>

                <!-- ================= CODE BARRES ================= -->
                <div class="center">
                    <table>
                        <tr>
                            <td style="color: white;">________</td>
                            <td>{!! DNS1D::getBarcodeHTML($vente->reference_vente, 'C128', 1.4, 40) !!}</td>
                            <td style="color: white;">__</td>
                        </tr>
                    </table>
                    Merci pour votre visite.
                </div>
            </div>

            @if (!$loop->last)
                <div class="page-break"></div>
            @endif
        @endforeach

    @endif




    {{-- ################################################################ RECU ARTICLE ###################################### --}}
    @if ($vente->details->whereNotNull('article_id')->count() > 0)

        <div class="page-break"></div>

        <!-- ================= HEADER ================= -->
        <table style="width:100%; margin-bottom:5px;">
            <tr>
                <td style="width:60px;">
                    <img src="{{ public_path('logo/logo.png') }}" style="width:55px;" alt="logo">
                </td>
                <td style="text-align:left; font-size:11px;">
                    <h2 style="margin:0; font-size:16px;">OMIT</h2>
                    BETELA BP-187 Toliara<br>
                    Tel : +261 34 18 250 90<br>
                    E-Mail : omit@moov.mg
                </td>
            </tr>
        </table>

        <hr>

        <!-- ================= INFORMATIONS VENTE ================= -->
        <table>
            <tr>
                <td>Ticket :</td>
                <td class="right">{{ $vente->reference_vente }}</td>
            </tr>
            <tr>
                <td>Date :</td>
                <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
            </tr>
            <tr>
                <td>Caissier :</td>
                <td class="right">{{ $vente->user->name ?? '' }}</td>
            </tr>
        </table>
        <hr>

        <!-- ================= ARTICLES ================= -->

        <table>

            <tr class="bold">
                <th>Designation</th>
                <th class="center">Qté</th>
                {{-- <th class="right">Prix</th> --}}
                <th class="right">Total</th>
            </tr>

            @foreach ($vente->details->whereNotNull('article_id') as $d)
                <tr>
                    <td>{{ Str::limit($d->article->designation ?? '', 28) ?? '' }}</td>
                    <td class="center">{{ $d->qte }}</td>
                    {{-- <td class="right">{{ number_format($d->prix_unitaire, 2, '.', ' ') }}</td> --}}
                    <td class="right">{{ number_format($d->montant, 2, '.', ' ') }}</td>
                </tr>
            @endforeach

        </table>

        <hr>


        <!-- ================= TOTALS ================= -->

        <table>
            <tr>
                <td>Sous-total</td>
                <td class="right">{{ number_format($totalArticle, 2, '.', ' ') }}</td>
            </tr>
            <tr>
                <td>Payé</td>
                <td class="right">{{ number_format($payeArticle, 2, '.', ' ') }}</td>
            </tr>
            <tr>
                <td>Monnaie</td>
                <td class="right">{{ number_format($monnaieArticle, 2, '.', ' ') }}</td>
            </tr>
            <tr class="bold big">
                <td>NET A PAYER</td>
                <td class="right">{{ number_format($totalArticle, 2, '.', ' ') }}</td>
            </tr>
        </table>

        <hr>

        <!-- ================= CODE BARRES ================= -->
        <div class="center">
            <table>
                <tr>
                    <td style="color: white;">________</td>
                    <td>{!! DNS1D::getBarcodeHTML($vente->reference_vente, 'C128', 1.4, 40) !!}</td>
                    <td style="color: white;">__</td>
                </tr>
            </table>
            Merci pour votre visite.
        </div>

    @endif


</body>

</html>

































{{-- 



 <!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <style>
        @page {
            margin: 0
        }

        body {
            font-family: monospace;
            font-size: 12px;
            width: 260px;
            margin: auto;
        }

        .center {
            text-align: center
        }

        .line {
            border-top: 1px dashed #000;
            margin: 6px 0;
        }

        table {
            width: 100%;
        }

        .left {
            text-align: left
        }

        .right {
            text-align: right
        }

        .big {
            font-size: 16px;
            font-weight: bold;
        }

        .ticket {
            page-break-after: always;
        }
    </style>

</head>

<body>

    @foreach ($tickets as $ticket)
        <div class="ticket">

            <div class="center">

                <h3>OMIT</h3>

                Address : BETELA BP-187 Toliara <br>
                Tel : +261 34 18 250 90 <br>
                E-Mail : omit@moov.mg

            </div>

            <div class="line"></div>

            <table>
                <tr>
                    <td>Date : {{ date('d-m-Y') }}</td>
                    <td class="right">{{ date('H:i') }}</td>
                </tr>
            </table>

            <div class="line"></div>

            <table>

                <tr>
                    <td>Patient</td>
                    <td class="right">{{ $ticket['consultation']->nom_patient }}</td>
                </tr>

                <tr>
                    <td>Genre</td>
                    <td class="right">
                        {{ $ticket['consultation']->sex_patient ? 'Homme' : 'Femme' }}
                    </td>
                </tr>

                <tr>
                    <td>Age</td>
                    <td class="right">
                        {{ $ticket['consultation']->age_patient }}
                        {{ $ticket['consultation']->unite_age ? 'Ans' : 'Mois' }}
                    </td>
                </tr>

                <tr>
                    <td>Docteur</td>
                    <td class="right">{{ $ticket['consultation']->docteurInfo->nom ?? '' }}</td>
                </tr>

                <tr>
                    <td>Type</td>
                    <td class="right">{{ ucfirst($ticket['consultation']->type_docteur) }}</td>
                </tr>

            </table>

            <div class="line"></div>

            <table>

                <tr class="big">
                    <td>CONSULTATION</td>
                    <td class="right"> {{ number_format($ticket['montant'], 0, '', ' ') }} Ar</td>
                </tr>

                <tr>
                    <td>Payé</td>
                    <td class="right">{{ number_format($ticket['paye'], 0, '', ' ') }} Ar</td>
                </tr>

                <tr>
                    <td>Monnaie</td>
                    <td class="right">{{ number_format($ticket['monnaie'], 0, '', ' ') }} Ar</td>
                </tr>

            </table>

            <div class="line"></div>

            <div class="center">


                {!! DNS1D::getBarcodeHTML($vente->reference_vente, 'C128', 1.4, 40) !!}



                <br>

                Merci pour votre visite.

            </div>

        </div>
    @endforeach


</body>

</html>  --}}
