@extends('layouts.app')

@section('title', 'Page - Gestion')

@section('app-content')

    <div class="col-xl-6 col-lg-12">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Justified Tab with top border</h4>
            </div>
            <div class="card-content">
                <div class="card-body">
                    <p>Use <code>.nav-justified.nav-top-border.no-hover-bg</code> classes justified top bordered tabs. you
                        can
                        also use <code>.nav-topline</code> class in place of <code>.nav-top-border</code> class</p>
                    <ul class="nav nav-tabs nav-top-border no-hover-bg nav-justified">
                        <li class="nav-item">
                            <a class="nav-link active" id="active-tab1" data-toggle="tab" href="#active1"
                                aria-controls="active1" aria-expanded="true">Active</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="link-tab1" data-toggle="tab" href="#link1" aria-controls="link1"
                                aria-expanded="false">Link</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
                                aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" id="dropdownOpt1-tab1" href="#dropdownOpt11" data-toggle="tab"
                                    aria-controls="dropdownOpt11" aria-expanded="true">dropdown 1</a>
                                <a class="dropdown-item" id="dropdownOpt2-tab1" href="#dropdownOpt12" data-toggle="tab"
                                    aria-controls="dropdownOpt12" aria-expanded="true">dropdown 2</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="linkOpt-tab1" data-toggle="tab" href="#linkOpt1"
                                aria-controls="linkOpt1">Another Link</a>
                        </li>
                    </ul>
                    <div class="tab-content px-1 pt-1">
                        <div role="tabpanel" class="tab-pane active" id="active1" aria-labelledby="active-tab1"
                            aria-expanded="true">
                            <p>Macaroon candy canes tootsie roll wafer lemon drops liquorice jelly-o tootsie roll cake.
                                Marzipan
                                liquorice soufflé cotton candy jelly cake jelly-o sugar plum marshmallow. Dessert cotton
                                candy
                                macaroon chocolate sugar plum cake donut.</p>
                        </div>
                        <div class="tab-pane" id="link1" role="tabpanel" aria-labelledby="link-tab1"
                            aria-expanded="false">
                            <p>Chocolate bar gummies sesame snaps. Liquorice cake sesame snaps cotton candy cake sweet
                                brownie.
                                Cotton candy candy canes brownie. Biscuit pudding sesame snaps pudding pudding sesame snaps
                                biscuit
                                tiramisu.</p>
                        </div>
                        <div class="tab-pane" id="dropdownOpt11" role="tabpanel" aria-labelledby="dropdownOpt1-tab1"
                            aria-expanded="false">
                            <p>Fruitcake marshmallow donut wafer pastry chocolate topping cake. Powder powder gummi bears
                                jelly
                                beans. Gingerbread cake chocolate lollipop. Jelly oat cake pastry marshmallow sesame snaps.
                            </p>
                        </div>
                        <div class="tab-pane" id="dropdownOpt12" role="tabpanel" aria-labelledby="dropdownOpt2-tab1"
                            aria-expanded="false">
                            <p>Soufflé cake gingerbread apple pie sweet roll pudding. Sweet roll dragée topping cotton candy
                                cake
                                jelly beans. Pie lemon drops sweet pastry candy canes chocolate cake bear claw cotton candy
                                wafer.</p>
                        </div>
                        <div class="tab-pane" id="linkOpt1" role="tabpanel" aria-labelledby="linkOpt-tab1"
                            aria-expanded="false">
                            <p>Cookie icing tootsie roll cupcake jelly-o sesame snaps. Gummies cookie dragée cake jelly
                                marzipan
                                donut pie macaroon. Gingerbread powder chocolate cake icing. Cheesecake gummi bears ice
                                cream
                                marzipan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
