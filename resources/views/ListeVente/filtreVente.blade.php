<li class="nav-item mr-2">

    <div class="dropdown">

        <button class="btn btn-sm btn-outline-info dropdown-toggle" type="button" id="filtreDate" data-toggle="dropdown">

            <i class="ft-calendar mr-1"></i>
            Aujourd'hui

        </button>

        <div class="dropdown-menu">

            <a class="dropdown-item filtre-date" href="#" data-type="today" data-action="filtre_vente">
                Aujourd'hui
            </a>

            <a class="dropdown-item filtre-date" href="#" data-type="yesterday" data-action="filtre_vente">
                Hier
            </a>

            <a class="dropdown-item filtre-date" href="#" data-type="month" data-action="filtre_vente">
                Ce mois
            </a>

        </div>

    </div>

</li>


<!-- Filtre date personnalisé -->
<li class="nav-item">

    <form action="#" id="filtre_vente" method="POST" class="form-inline">

        <input type="date" name="date_debut" id="date_debut" class="form-control form-control-sm mr-1">

        <span class="mx-1 text-muted">—</span>

        <input type="date" name="date_fin" id="date_fin" class="form-control form-control-sm mr-2">

        <button type="button" data-action="filtrer_vente" class="btn btn-sm btn-info">

            <i class="ft-search"></i>

        </button>

    </form>

</li>
