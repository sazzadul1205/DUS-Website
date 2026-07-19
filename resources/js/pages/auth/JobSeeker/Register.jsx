/* eslint-disable no-undef */
// pages/auth/register.jsx

import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
  LoaderCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export default function Register({ googleAuthEnabled, status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
  };

  // Password strength indicator with more detailed feedback
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200', requirements: [] };

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];
    const textColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

    const requirements = [
      { met: checks.length, text: 'At least 8 characters' },
      { met: checks.uppercase && checks.lowercase, text: 'Uppercase & lowercase' },
      { met: checks.number, text: 'Contains a number' },
      { met: checks.special, text: 'Contains a special character' },
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
      textColor: textColors[score],
      requirements,
      checks
    };
  };

  const passwordStrength = getPasswordStrength(data.password);

  return (
    <>
      <Head title="Register" />
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 relative overflow-hidden">
        {/* Subtle background gradient - very soft and minimal */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className={`flex w-full items-center justify-center transition-all duration-700 ease-out lg:grow relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <main className="flex w-full max-w-83.75 flex-col lg:max-w-lg lg:flex-row">
            {/* Left side - Registration Form */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/80 backdrop-blur-sm p-6 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#19140015] lg:rounded-tl-lg lg:rounded-br-none lg:p-12">

              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    Create account
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </h2>
                  <p className="mt-1 text-sm text-[#706f6c]">
                    Join Job Match and find your perfect career opportunity
                  </p>
                </div>
              </div>

              <form className="flex flex-col gap-5" onSubmit={submit}>
                {/* Email Field */}
                <div className="grid gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-[#1b1b18]">
                    <Mail className="h-3.5 w-3.5 text-[#706f6c]" />
                    Email address
                  </label>
                  <div className={`
                    relative transition-all duration-200 rounded-sm
                    ${focusedField === 'email' ? 'ring-2 ring-[#1b1b18] ring-offset-1 ring-offset-transparent' : ''}
                    ${touched.email && errors.email ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-transparent' : ''}
                  `}>
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
                      onBlur={() => handleBlur('email')}
                      disabled={processing}
                      placeholder="email@example.com"
                      className={`w-full rounded-sm border bg-white/50 px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c] transition-all duration-200
                        ${errors.email && touched.email ? 'border-red-500' : 'border-[#19140035]'}
                      `}
                    />
                    {data.email && !errors.email && touched.email && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-[#1b1b18]">
                    <Lock className="h-3.5 w-3.5 text-[#706f6c]" />
                    Password
                  </label>
                  <div className={`
                    relative transition-all duration-200 rounded-sm
                    ${focusedField === 'password' ? 'ring-2 ring-[#1b1b18] ring-offset-1 ring-offset-transparent' : ''}
                    ${touched.password && errors.password ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-transparent' : ''}
                  `}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="new-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => handleBlur('password')}
                      disabled={processing}
                      placeholder="Create a strong password"
                      className={`w-full rounded-sm border bg-white/50 px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c] transition-all duration-200
                        ${errors.password && touched.password ? 'border-red-500' : 'border-[#19140035]'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                      tabIndex={-1}
                      disabled={processing}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength with detailed requirements */}
                  {data.password && (
                    <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        {passwordStrength.label && (
                          <span className={`text-xs font-medium ${passwordStrength.textColor} whitespace-nowrap`}>
                            {passwordStrength.label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {passwordStrength.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs">
                            {req.met ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-gray-300" />
                            )}
                            <span className={req.met ? 'text-[#1b1b18]' : 'text-[#706f6c]'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="grid gap-1.5">
                  <label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-2 text-[#1b1b18]">
                    <Shield className="h-3.5 w-3.5 text-[#706f6c]" />
                    Confirm password
                  </label>
                  <div className={`
                    relative transition-all duration-200 rounded-sm
                    ${focusedField === 'confirm' ? 'ring-2 ring-[#1b1b18] ring-offset-1 ring-offset-transparent' : ''}
                    ${touched.confirm && errors.password_confirmation ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-transparent' : ''}
                  `}>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      tabIndex={3}
                      autoComplete="new-password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => handleBlur('confirm')}
                      disabled={processing}
                      placeholder="Confirm your password"
                      className={`w-full rounded-sm border bg-white/50 px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#706f6c] transition-all duration-200
                        ${errors.password_confirmation && touched.confirm ? 'border-red-500' : 'border-[#19140035]'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                      tabIndex={-1}
                      disabled={processing}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {data.password_confirmation && data.password === data.password_confirmation && data.password.length > 0 && (
                      <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {touched.confirm && errors.password_confirmation && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:bg-black/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-2"
                  tabIndex={4}
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
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

                {/* Google Sign Up */}
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

                {/* Login link */}
                <p className="text-center text-sm text-[#706f6c]">
                  Already have an account?{' '}
                  <Link
                    href={route('login')}
                    className="font-medium text-[#1b1b18] hover:underline underline-offset-4 transition-colors hover:text-[#1b1b18]/70"
                    tabIndex={5}
                  >
                    Log in
                  </Link>
                </p>
              </form>

              {/* Status Message */}
              {status && (
                <div className="mt-6 rounded-sm border border-green-200 bg-green-50/80 backdrop-blur-sm p-4 text-sm font-medium text-green-700 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                  {status}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}