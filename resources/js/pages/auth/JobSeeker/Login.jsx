/* eslint-disable no-undef */
// pages/auth/job-seeker-login.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  LoaderCircle, Eye, EyeOff, User, Star, Mail, Lock, ArrowRight,
  ChevronUp, ChevronDown,
} from 'lucide-react';

export default function JobSeekerLogin({ status, canResetPassword, googleAuthEnabled }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  // Check if demo mode is enabled via environment variable
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const submit = (e) => {
    e.preventDefault();
    post(route('seeker.login'), {
      onFinish: () => reset('password'),
    });
  };

  const fillDemoAccount = (email, password) => {
    setData({
      email,
      password,
      remember: data.remember,
    });
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.focus();
  };

  // Job Seeker Demo Accounts
  const demoAccounts = [
    {
      role: 'Job Seeker',
      email: 'jobseeker@gmail.com',
      password: 'password',
      icon: User,
      description: 'Browse jobs, apply, and track applications',
      badge: 'Job Seeker',
      badgeColor: 'bg-orange-100 text-orange-700',
      borderColor: 'orange',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-50 hover:bg-orange-100',
      buttonBorder: 'border-orange-200',
      buttonText: 'text-orange-700',
    },
    {
      role: 'Job Seeker',
      email: 'jobseeker2@gmail.com',
      password: 'password',
      icon: User,
      description: 'Entry-level developer looking for opportunities',
      badge: 'Job Seeker',
      badgeColor: 'bg-orange-100 text-orange-700',
      borderColor: 'orange',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-50 hover:bg-orange-100',
      buttonBorder: 'border-orange-200',
      buttonText: 'text-orange-700',
    },
  ];

  const currentAccount = demoAccounts[currentDemoIndex];

  const goToPrevious = () => {
    setCurrentDemoIndex((prev) => (prev === 0 ? demoAccounts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentDemoIndex((prev) => (prev === demoAccounts.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Head title="Job Seeker Login" />
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 relative overflow-hidden">
        {/* Subtle background gradient - very soft and minimal */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-50/30 via-transparent to-amber-50/20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0 relative z-10">
          <main className={`flex w-full max-w-83.75 flex-col ${isDemoMode ? 'lg:max-w-4xl lg:flex-row' : 'lg:max-w-lg lg:flex-row'}`}>
            {/* Left side - Login Form */}
            <div className={`flex-1 rounded-br-lg rounded-bl-lg bg-white/80 backdrop-blur-sm p-6 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#19140015] ${isDemoMode ? 'lg:rounded-tl-lg lg:rounded-br-none' : 'lg:rounded-lg'} lg:p-12`}>


              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold">Job Seeker Login</h2>
              </div>
              <p className="mb-8 text-sm text-[#706f6c]">
                Enter your credentials to access your job seeker account
              </p>

              <form className="flex flex-col gap-5" onSubmit={submit}>
                {/* Email Field */}
                <div className="grid gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-[#1b1b18]">
                    <Mail className="h-3.5 w-3.5 text-[#706f6c]" />
                    Email address
                  </label>
                  <div className={`relative transition-all duration-200 rounded-sm ${focusedField === 'email' ? 'ring-2 ring-[#1b1b18] ring-offset-1 ring-offset-transparent' : ''}`}>
                    <input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="email@example.com"
                      className="w-full rounded-sm border border-[#19140035] bg-white/50 px-3 py-2.5 text-sm focus:outline-none placeholder:text-[#706f6c] transition-all duration-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-[#1b1b18]">
                      <Lock className="h-3.5 w-3.5 text-[#706f6c]" />
                      Password
                    </label>
                    {canResetPassword && (
                      <a
                        href={route('password.request')}
                        className="text-xs text-[#706f6c] hover:text-[#1b1b18] underline-offset-4 hover:underline transition-colors"
                        tabIndex={5}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className={`relative transition-all duration-200 rounded-sm ${focusedField === 'password' ? 'ring-2 ring-[#1b1b18] ring-offset-1 ring-offset-transparent' : ''}`}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="w-full rounded-sm border border-[#19140035] bg-white/50 px-3 py-2.5 pr-10 text-sm focus:outline-none placeholder:text-[#706f6c] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    tabIndex={3}
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 rounded-sm border-[#19140035] text-[#1b1b18] focus:ring-2 focus:ring-[#1b1b18]"
                  />
                  <label htmlFor="remember" className="text-sm text-[#706f6c] cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:bg-black/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-2 cursor-pointer"
                  tabIndex={4}
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in as Job Seeker
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Divider */}
                {googleAuthEnabled && (
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e3e3e0]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white/80 backdrop-blur-sm px-4 text-[#706f6c]">or continue with</span>
                    </div>
                  </div>
                )}

                {/* Google Sign In */}
                {googleAuthEnabled && (
                  <a
                    href={route('auth.google.redirect')}
                    className="flex items-center justify-center gap-3 rounded-sm border border-[#19140035] px-5 py-2.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#f8f8f6] active:scale-[0.99] transition-all duration-200 group"
                  >
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                    <span className="text-[#706f6c] text-xs group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                  </a>
                )}

                {errors.google && (
                  <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                    {errors.google}
                  </p>
                )}

                {/* Sign up link */}
                <p className="text-center text-sm text-[#706f6c]">
                  Don't have an account?{' '}
                  <a
                    href={route('register')}
                    className="font-medium text-[#1b1b18] hover:underline underline-offset-4 transition-colors hover:text-[#1b1b18]/70"
                    tabIndex={5}
                  >
                    Sign up as Job Seeker
                  </a>
                </p>
              </form>

              {/* Status Message */}
              {status && (
                <div className="mt-6 rounded-sm border border-green-200 bg-green-50/80 backdrop-blur-sm p-4 text-sm font-medium text-green-700 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <span className="shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full" />
                  {status}
                </div>
              )}
            </div>

            {/* Right side - Demo Accounts Carousel - Only shown if demo mode is enabled */}
            {isDemoMode && (
              <div className="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-96 lg:rounded-t-none lg:rounded-r-lg">
                <div className={`absolute inset-0 bg-linear-to-br ${currentAccount.bgGradient}`} />

                <div className="relative p-6 lg:p-8 flex flex-col justify-center h-full">
                  <div className="mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-[#F53003]" />
                      <h3 className="text-lg font-semibold text-[#1b1b18]">Job Seeker Demo Accounts</h3>
                    </div>
                    <p className="text-sm text-[#706f6c]">
                      Try with pre-configured job seeker accounts
                    </p>
                  </div>

                  {/* Carousel Navigation - Up/Down Buttons */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={goToPrevious}
                      className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Previous account"
                    >
                      <ChevronUp className="h-5 w-5 text-[#1b1b18]" />
                    </button>
                    <div className="mx-4 px-3 py-1 rounded-full bg-white/50 text-xs font-medium text-[#706f6c]">
                      {currentDemoIndex + 1} / {demoAccounts.length}
                    </div>
                    <button
                      onClick={goToNext}
                      className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Next account"
                    >
                      <ChevronDown className="h-5 w-5 text-[#1b1b18]" />
                    </button>
                  </div>

                  {/* Current Demo Account Card */}
                  <div className="transition-all duration-300 transform animate-fade-in">
                    <div className={`rounded-xl border shadow-lg overflow-hidden ${currentAccount.buttonBorder} bg-white/80 backdrop-blur-sm`}>
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentAccount.iconBg} transition-all duration-200`}>
                            <currentAccount.icon className={`h-6 w-6 ${currentAccount.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-lg text-[#1b1b18]">
                                {currentAccount.role}
                              </h4>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${currentAccount.badgeColor}`}>
                                {currentAccount.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#706f6c] mt-1">
                              {currentAccount.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-5 p-3 rounded-lg bg-[#FDFDFC]/80 backdrop-blur-sm border border-[#e3e3e0]">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-[#706f6c] shrink-0" />
                            <span className="text-[#706f6c]">Email:</span>
                            <span className="font-mono font-medium text-[#1b1b18] truncate text-xs break-all">
                              {currentAccount.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Lock className="h-3 w-3 text-[#706f6c] shrink-0" />
                            <span className="text-[#706f6c]">Password:</span>
                            <span className="font-mono font-medium text-[#1b1b18] text-xs">
                              ••••••••
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => fillDemoAccount(currentAccount.email, currentAccount.password)}
                          className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${currentAccount.buttonBg} ${currentAccount.buttonBorder} ${currentAccount.buttonText} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group`}
                        >
                          <span>Use This Account</span>
                          <ArrowRight className="h-3 w-3 transition-all duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-[#19140010]">
                    <p className="text-xs text-[#706f6c] text-center">
                      <span className="inline-block mr-1">💡</span>
                      Use the navigation buttons to cycle through demo accounts
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg pointer-events-none" />
              </div>
            )}
          </main>
        </div>
        <div className="hidden h-14.5 lg:block" />
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}