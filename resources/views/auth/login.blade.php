 @extends('login.index')

 @section('login-content')
     <section class="row flexbox-container">
         <div class="col-12 d-flex align-items-center justify-content-center">
             <div class="col-lg-4 col-md-8 col-10 box-shadow-2 p-0">
                 <div class="login-card border-grey border-lighten-3 m-0">
                     <div class="card-header border-0">
                         <div class="card-title text-center">
                             <div class="p-1"><img src="{{ asset('logo/logo.png') }}" style="width: 100px; border-radius: 50%;"
                                     alt="branding logo"></div>
                         </div>
                         <h6 class="card-subtitle line-on-side text-muted text-center font-small-3 pt-2"><span>Login</span>
                         </h6>
                     </div>
                     <div class="card-content">
                         <div class="card-body">
                             <form class="form-horizontal form-simple" action="{{ route('login') }}" method="POST">
                                 @csrf
                                 <fieldset class="form-group position-relative has-icon-left mb-0">
                                     <input type="text" class="form-control" id="user-name" placeholder="Your Email" value="{{ old('username') }}"
                                         name="username" required>
                                     <div class="form-control-position">
                                         <i class="la la-user"></i>
                                     </div>
                                     @error('username')
                                         <p class="text-danger">{{ $message }}</p>
                                     @enderror
                                 </fieldset>
                                 <br>
                                 <fieldset class="form-group position-relative has-icon-left">
                                     <input type="password" class="form-control" id="user-password"
                                         placeholder="Enter Password" name="password" required>
                                     <div class="form-control-position">
                                         <i class="la la-key"></i>
                                     </div>
                                      @error('password')
                                         <p class="text-danger">{{ $message }}</p>
                                     @enderror
                                 </fieldset>
                                 {{-- <div class="form-group row">
                                     <div class="col-sm-6 col-12 text-center text-sm-left">
                                         <fieldset>
                                             <input type="checkbox" id="remember-me" class="chk-remember" name="remember">
                                             <label for="remember-me"> Remember Me</label>
                                         </fieldset>
                                     </div>
                                 </div> --}}
                                 <button type="submit" class="btn btn-info btn-block"><i class="ft-unlock"></i>
                                     Se connecter</button>
                             </form>
                         </div>
                     </div>
                     <div class="card-footer">

                     </div>
                 </div>
             </div>
         </div>
     </section>
 @endsection
