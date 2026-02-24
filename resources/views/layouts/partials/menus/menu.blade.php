 <!-- BEGIN: Main Menu-->

 <div class="main-menu menu-fixed menu-dark menu-accordion menu-shadow" data-scroll-to-active="true">
     <div class="main-menu-content">
         <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">

             <li class=" nav-item active"><a href="{{ route('dashboard') }}"><i class="la la-shopping-cart"></i><span
                         class="menu-title" data-i18n="dashboard">Dashboard</span></a>
             </li>

             <li class=" nav-item"><a href="#"><i class="la la-shopping-cart"></i><span class="menu-title"
                         data-i18n="vente">Ventes</span></a>
             </li>

             <li class=" nav-item"><a href="#"><i class="la la-television"></i><span class="menu-title"
                         data-i18n="pharmacie">Pharmacie</span></a>
                 <ul class="menu-content">
                     <li class=" nav-item"><a href="{{ route('article.index') }}"><i
                                 class="la la-shopping-cart"></i><span class="menu-title"
                                 data-i18n="article">Articles</span></a>
                     </li>
                     <li class=" nav-item"><a href="#"><i class="la la-shopping-cart"></i><span class="menu-title"
                                 data-i18n="entree">Entrées</span></a>
                     </li>
                     <li class=" nav-item"><a href="#"><i class="la la-shopping-cart"></i><span class="menu-title"
                                 data-i18n="sortie">Sorties</span></a>
                     </li>
                     <li class=" nav-item"><a href="#"><i class="la la-shopping-cart"></i><span class="menu-title"
                                 data-i18n="rumeur">Rumeur</span></a>
                     </li>

                 </ul>
             </li>

             @if (Auth::user()->hasRole('superAdmin'))
                 <li class=" nav-item"><a href="{{ route('utilisateur.index') }}"><i class="la la-user"></i><span
                             class="menu-title" data-i18n="utilisateur">Utilisateurs</span></a>
                 </li>
             @endif


         </ul>
     </div>
 </div>

 <!-- END: Main Menu-->
