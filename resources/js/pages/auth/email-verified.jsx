// pages/auth/email-verified.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Mail, ArrowRight, LoaderCircle, RotateCw, LayoutDashboard, Star, Briefcase } from 'lucide-react';

export default function EmailVerified({ status }) {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const handleGoToProfileComplete = () => {
    router.get(route('profile.complete'));
  };

  const handleResendVerification = () => {
    setResending(true);
    router.post(route('verification.send'), {}, {
      onSuccess: () => {
        setResendStatus('sent');
        setResending(false);
        setTimeout(() => setResendStatus(null), 5000);
      },
      onFinish: () => setResending(false)
    });
  };

  return (
    <>
      <Head title="Email Verified" />

      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-83.75 flex-col lg:max-w-4xl lg:flex-row">
            {/* Left side - Success Content */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1b1b18] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-tight">Job Match</h1>
                  <p className="text-xs text-[#706f6c]">Find your perfect match</p>
                </div>
              </div>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-semibold text-center">Email Verified!</h2>
              <p className="mb-8 text-[#706f6c] text-center">
                Your email has been successfully verified. You can now complete your profile and start your job search journey.
              </p>

              {/* Success Info Card */}
              <div className="rounded-sm border border-[#e3e3e0] bg-[#FDFDFC] p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1b1b18]">Verification Complete</h4>
                    <p className="text-xs text-[#706f6c]">Your account is now fully activated</p>
                  </div>
                </div>
                <div className="border-t border-[#e3e3e0] pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#706f6c]">Account Status:</span>
                    <span className="font-medium text-green-600">Verified ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[#706f6c]">Access Level:</span>
                    <span className="font-medium text-[#1b1b18]">Full Access</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGoToProfileComplete}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Complete Your Profile
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Resend Section */}
              <div className="text-center mt-6 pt-4 border-t border-[#e3e3e0]">
                <p className="text-sm text-[#706f6c]">
                  Didn't receive the email?{' '}
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="inline-flex items-center font-medium text-[#1b1b18] hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? (
                      <>
                        <LoaderCircle className="animate-spin h-3 w-3 mr-1" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RotateCw className="h-3 w-3 mr-1" />
                        Click here to resend
                      </>
                    )}
                  </button>
                </p>
                <p className="mt-2 text-xs text-[#706f6c]">
                  Check your spam folder if you don't see the email in your inbox
                </p>
              </div>

              {/* Status Message */}
              {resendStatus === 'sent' && (
                <div className="mt-4 rounded-sm border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  A new verification link has been sent to your email address.
                </div>
              )}
            </div>

            {/* Right side - Next Steps Card */}
            <div className="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-96 lg:rounded-t-none lg:rounded-r-lg">
              <div className="absolute inset-0 bg-linear-to-br from-green-50 to-emerald-100" />

              <div className="relative p-6 lg:p-8 flex flex-col justify-center h-full">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-[#F53003]" />
                    <h3 className="text-lg font-semibold text-[#1b1b18]">What's Next?</h3>
                  </div>
                  <p className="text-sm text-[#706f6c]">
                    Complete these steps to start your job search
                  </p>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Complete Your Profile</h4>
                      <p className="text-xs text-[#706f6c]">Add your skills, experience, and preferences</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Browse Job Matches</h4>
                      <p className="text-xs text-[#706f6c]">Discover jobs tailored to your skills</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1b1b18]">Start Applying</h4>
                      <p className="text-xs text-[#706f6c]">Submit applications and track your progress</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 p-3 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold text-[#1b1b18]">500+</div>
                      <div className="text-xs text-[#706f6c]">Active Jobs</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold text-[#1b1b18]">50+</div>
                      <div className="text-xs text-[#706f6c]">Companies</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold text-[#1b1b18]">2K+</div>
                      <div className="text-xs text-[#706f6c]">Job Seekers</div>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#706f6c] flex items-center justify-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    Complete your profile to get personalized job recommendations
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg pointer-events-none" />
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}