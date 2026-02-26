<div class="main-menu menu-fixed menu-dark menu-accordion menu-shadow" data-scroll-to-active="true">
    <div class="main-menu-content">
        <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">

            <li class="nav-item">
                <a href="{{ route('dashboard') }}" class="menu-item">
                    <i class="la la-dashboard"></i>
                    <span class="menu-title">Dashboard</span>
                </a>
            </li>

            <li class="nav-item">
                <a href="#" class="menu-item">
                    <i class="la la-shopping-cart"></i>
                    <span class="menu-title">Ventes</span>
                </a>
            </li>

            <li class="nav-item">
                <a href="#" class="menu-item">
                    <i class="la la-television"></i>
                    <span class="menu-title">Pharmacie</span>
                </a>
                <ul class="menu-content">
                    <li class="nav-item">
                        <a href="{{ route('article.index') }}" class="menu-item">
                            <i class="la la-shopping-cart"></i>
                            <span class="menu-title">Articles</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="menu-item">
                            <i class="la la-shopping-cart"></i>
                            <span class="menu-title">Entrées</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="menu-item">
                            <i class="la la-shopping-cart"></i>
                            <span class="menu-title">Sorties</span>
                        </a>
                    </li>
                </ul>
            </li>

            <li class="nav-item">
                <a href="{{ route('gestion.index') }}" class="menu-item">
                    <i class="la la-user"></i>
                    <span class="menu-title">Gestion</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="{{ route('utilisateur.index') }}" class="menu-item">
                    <i class="la la-user"></i>
                    <span class="menu-title">Utilisateurs</span>
                </a>
            </li>


        </ul>
    </div>
</div>
