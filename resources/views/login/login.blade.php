 @extends('login.index')

 @section('login-content')
     <section class="row flexbox-container">
         <div class="col-12 d-flex align-items-center justify-content-center">
             <div class="col-lg-4 col-md-8 col-10 box-shadow-2 p-0">
                 <div class="card border-grey border-lighten-3 m-0">
                     <div class="card-header border-0">
                         <div class="card-title text-center">
                             <div class="p-1"><img src="{{ asset('app-assets/images/logo/logo-dark.png') }}"
                                     alt="branding logo"></div>
                         </div>
                         <h6 class="card-subtitle line-on-side text-muted text-center font-small-3 pt-2"><span>Login with
                                 Modern</span>
                         </h6>
                     </div>
                     <div class="card-content">
                         <div class="card-body">
                             <form class="form-horizontal form-simple" action="{{ route('login') }}" method="POST">
                                 @csrf
                                 <fieldset class="form-group position-relative has-icon-left mb-0">
                                     <input type="text" class="form-control" id="user-name" placeholder="Your Username"
                                         name="email" required>
                                     <div class="form-control-position">
                                         <i class="la la-user"></i>
                                     </div>
                                 </fieldset>
                                 <fieldset class="form-group position-relative has-icon-left">
                                     <input type="password" class="form-control" id="user-password"
                                         placeholder="Enter Password" name="password" required>
                                     <div class="form-control-position">
                                         <i class="la la-key"></i>
                                     </div>
                                 </fieldset>
                                 <div class="form-group row">
                                     <div class="col-sm-6 col-12 text-center text-sm-left">
                                         <fieldset>
                                             <input type="checkbox" id="remember-me" class="chk-remember" name="remember">
                                             <label for="remember-me"> Remember Me</label>
                                         </fieldset>
                                     </div>
                                     <div class="col-sm-6 col-12 text-center text-sm-right"><a
                                             href="{{ route('password.request') }}" class="card-link">Forgot Password?</a>
                                     </div>
                                 </div>
                                 <button type="submit" class="btn btn-info btn-block"><i class="ft-unlock"></i>
                                     Login</button>
                             </form>
                         </div>
                     </div>
                     <div class="card-footer">
                         <div class="">
                             <p class="float-xl-left text-center m-0"><a href="{{ route('password.request') }}"
                                     class="card-link">Recover
                                     password</a></p>
                             <p class="float-xl-right text-center m-0">New to Moden Admin? <a href="{{ route('register') }}"
                                     class="card-link">Sign Up</a></p>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </section>
 @endsection
