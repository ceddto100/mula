import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-brand-700/70 bg-brand-900/60 p-6 shadow-2xl backdrop-blur-sm md:p-10">
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-accent-electric/15 blur-3xl" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-brand-400/40 bg-brand-800/80 px-4 py-1 text-xs font-grotesk tracking-[0.2em] text-brand-100">
            MEMBER ACCESS
          </p>
          <h1 className="font-display text-4xl text-white md:text-6xl">SIGN IN</h1>
          <p className="mt-4 max-w-md text-sm text-brand-100/85 md:text-base">
            Access your orders, saved items, and account details. Continue your shopping journey with one secure click.
          </p>

          <div className="mt-8 space-y-3 text-sm text-brand-100/90">
            <p>• Track and reorder your latest purchases</p>
            <p>• Sync wishlist items across your devices</p>
            <p>• Checkout faster with saved profile details</p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-500/40 bg-white p-6 shadow-xl md:p-8">
          <h2 className="mb-2 text-2xl font-semibold text-brand-900">Welcome back</h2>
          <p className="mb-6 text-sm text-gray-600">Sign in with Google to continue.</p>

          <GoogleLoginButton />

          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
