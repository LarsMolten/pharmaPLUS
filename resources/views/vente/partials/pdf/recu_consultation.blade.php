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
            margin: 0;
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

        .page-break-before {
            page-break-before: always;
        }

        .page-break-after {
            page-break-after: always;
        }
    </style>

</head>

    <body>

        @php
            $has_consultation = $vente->details->whereNotNull('consultation_id')->count();
            $has_article = $vente->details->whereNotNull('article_id')->count();
            $has_analyse = $vente->details->whereNotNull('analyse_id')->count();
            $has_service = $vente->details->whereNotNull('service_id')->count();
            $has_kit = $vente->details->whereNotNull('kit_id')->count();
        @endphp


        {{-- ############################################################# RECU CONSULTATION ###################################### --}}
        @if ($has_consultation > 0)
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
                            <td>RECU N° :</td>
                            <td class="right">{{ $vente->reference_vente }}</td>
                        </tr>
                        <tr>
                            <td>Date :</td>
                            <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                        </tr>
                        <tr>
                            <td>Client :</td>
                            <td class="right">{{ $vente->client ?? '' }}</td>
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

                        <tr class="bold big">
                            <td>TOTAL A PAYER</td>
                            <td class="right">{{ number_format($ticket['montant'], 2, '.', ' ') }}</td>
                        </tr>
                        <tr>
                            <td>Montant reçu</td>
                            <td class="right">{{ number_format($ticket['paye'], 2, '.', ' ') }}</td>
                        </tr>

                        <tr>
                            <td>Monnaie rendue</td>
                            <td class="right">{{ number_format($ticket['monnaie'], 2, '.', ' ') }}</td>
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
                    {{-- <div class="page-break-before"></div> --}}
                    <div class="page-break-after"></div>
                @endif
            @endforeach

        @endif


        {{-- ################################################################ RECU SERVICE ###################################### --}}
        @if ($has_service > 0)

            @if ($has_consultation > 0)
                <div class="page-break-before"></div>
            @endif


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
                    <td>RECU N° :</td>
                    <td class="right">{{ $vente->reference_vente }}</td>
                </tr>
                <tr>
                    <td>Date :</td>
                    <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                </tr>
                <tr>
                    <td>Client :</td>
                    <td class="right">{{ $vente->client ?? '' }}</td>
                </tr>
                <tr>
                    <td>Caissier :</td>
                    <td class="right">{{ $vente->user->name ?? '' }}</td>
                </tr>
            </table>
            <hr>

            <!-- ================= SERVICES ================= -->

            <table>

                <tr class="bold">
                    <th>Designation</th>
                    <th class="center">Qté</th>
                    {{-- <th class="right">Prix</th> --}}
                    <th class="right">Total</th>
                </tr>

                @foreach ($vente->details->whereNotNull('service_id') as $s)
                    <tr>
                        <td>{{ Str::limit($s->service->nom_service ?? '', 28) ?? '' }}</td>
                        <td class="center">{{ $s->qte }}</td>
                        {{-- <td class="right">{{ number_format($d->prix_unitaire, 2, '.', ' ') }}</td> --}}
                        <td class="right">{{ number_format($s->montant, 2, '.', ' ') }}</td>
                    </tr>
                @endforeach

            </table>

            <hr>


            <!-- ================= TOTALS ================= -->

            <table>
                <tr>
                    <td>Sous-total</td>
                    <td class="right">{{ number_format($totalService, 2, '.', ' ') }}</td>
                </tr>
                <tr class="bold big">
                    <td>TOTAL A PAYER</td>
                    <td class="right">{{ number_format($totalService, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Montant reçu</td>
                    <td class="right">{{ number_format($payeService, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Monnaie rendue</td>
                    <td class="right">{{ number_format($monnaieService, 2, '.', ' ') }}</td>
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


        {{-- ################################################################ RECU ARTICLE ###################################### --}}
        @if ($has_article > 0)

            @if ($has_consultation > 0 || $has_service > 0)
                <div class="page-break-before"></div>
            @endif


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
                    <td>RECU N° :</td>
                    <td class="right">{{ $vente->reference_vente }}</td>
                </tr>
                <tr>
                    <td>Date :</td>
                    <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                </tr>
                <tr>
                    <td>Client :</td>
                    <td class="right">{{ $vente->client ?? '' }}</td>
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
                <tr class="bold big">
                    <td>TOTAL A PAYER</td>
                    <td class="right">{{ number_format($totalArticle, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Montant reçu</td>
                    <td class="right">{{ number_format($payeArticle, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Monnaie rendue</td>
                    <td class="right">{{ number_format($monnaieArticle, 2, '.', ' ') }}</td>
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


        {{-- ################################################################ RECU ANALYSE ###################################### --}}
        @if ($has_analyse > 0)

            @if ($has_consultation > 0 || $has_service > 0 || $has_article > 0)
                <div class="page-break-before"></div>
            @endif
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
                    <td>RECU N° :</td>
                    <td class="right">{{ $vente->reference_vente }}</td>
                </tr>
                <tr>
                    <td>Date :</td>
                    <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                </tr>
                <tr>
                    <td>Client :</td>
                    <td class="right">{{ $vente->client ?? '' }}</td>
                </tr>
                <tr>
                    <td>Caissier :</td>
                    <td class="right">{{ $vente->user->name ?? '' }}</td>
                </tr>
            </table>
            <hr>

            <!-- ================= ANALYSE ================= -->

            <table>

                <tr class="bold">
                    <th>Designation</th>
                    <th class="center">Qté</th>
                    {{-- <th class="right">Prix</th> --}}
                    <th class="right">Total</th>
                </tr>


                <tr>
                    {{-- <td>{{ $nomsAnalyses }}</td> --}}
                    {{-- <td>{!! wordwrap($nomsAnalyses ?? '', 16, "<br>", true) !!}</td> --}}
                    <td>
                        @foreach (explode(',', $nomsAnalyses) as $analyse)
                            {{ trim($analyse) }}<br>
                        @endforeach
                    </td>
                    <td class="center">{{ 1 }}</td>
                    {{-- <td class="right">{{ number_format($d->prix_unitaire, 2, '.', ' ') }}</td> --}}
                    <td class="right">{{ number_format($totalAnalyse, 2, '.', ' ') }}</td>
                </tr>


            </table>

            <hr>

            <!-- ================= TOTALS ================= -->

            <table>
                <tr>
                    <td>Sous-total</td>
                    <td class="right">{{ number_format($totalAnalyse, 2, '.', ' ') }}</td>
                </tr>
                <tr class="bold big">
                    <td>TOTAL A PAYER</td>
                    <td class="right">{{ number_format($totalAnalyse, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Montant reçu</td>
                    <td class="right">{{ number_format($payeAnalyse, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Monnaie rendue</td>
                    <td class="right">{{ number_format($monnaieAnalyse, 2, '.', ' ') }}</td>
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
            {{-- <div class="page-break-after"></div> --}}
        @endif


        {{-- ################################################################### RECU KIT ###################################### --}}
        @if ($has_kit > 0)

            @if ($has_consultation > 0 || $has_service > 0 || $has_article > 0 || $has_analyse > 0)
                <div class="page-break-before"></div>
            @endif


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
                    <td>RECU N° :</td>
                    <td class="right">{{ $vente->reference_vente }}</td>
                </tr>
                <tr>
                    <td>Date :</td>
                    <td class="right">{{ date('d-m-Y') }} {{ date('H:i') }}</td>
                </tr>
                <tr>
                    <td>Client :</td>
                    <td class="right">{{ $vente->client ?? '' }}</td>
                </tr>
                <tr>
                    <td>Caissier :</td>
                    <td class="right">{{ $vente->user->name ?? '' }}</td>
                </tr>
            </table>
            <hr>

            <!-- ================= SERVICES ================= -->

            <table>

                <tr class="bold">
                    <th>Designation</th>
                    <th class="center">Qté</th>
                    {{-- <th class="right">Prix</th> --}}
                    <th class="right">Total</th>
                </tr>

                @foreach ($vente->details->whereNotNull('kit_id') as $k)
                    <tr>
                        <td>{{ Str::limit($k->kit->nom_kit ?? '', 26) ?? '' }}</td>
                        <td class="center">{{ $k->qte }}</td>
                        {{-- <td class="right">{{ number_format($d->prix_unitaire, 2, '.', ' ') }}</td> --}}
                        <td class="right">{{ number_format($k->montant, 2, '.', ' ') }}</td>
                    </tr>
                @endforeach

            </table>

            <hr>


            <!-- ================= TOTALS ================= -->

            <table>
                <tr>
                    <td>Sous-total</td>
                    <td class="right">{{ number_format($totalKit, 2, '.', ' ') }}</td>
                </tr>
                <tr class="bold big">
                    <td>TOTAL A PAYER</td>
                    <td class="right">{{ number_format($totalKit, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Montant reçu</td>
                    <td class="right">{{ number_format($payeKit, 2, '.', ' ') }}</td>
                </tr>
                <tr>
                    <td>Monnaie rendue</td>
                    <td class="right">{{ number_format($monnaieKit, 2, '.', ' ') }}</td>
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


