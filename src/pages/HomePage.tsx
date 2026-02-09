import { Link } from 'react-router-dom';
import { Shield, Link2, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import heroMainImg from '@/assets/images/hero-main.png';
import whatsappImg from '@/assets/images/whatsapp.png';
import instagramImg from '@/assets/images/instagram.png';
import facebookImg from '@/assets/images/facebook.png';

export function HomePage() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* Header — simple bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-4 pr-28 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/payloom-logo.jpeg" alt="PayLoom" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-bold text-lg text-gray-900">PayLoom</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#how" className="text-sm text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <Link to="/legal" className="text-sm text-gray-600 hover:text-gray-900">Legal</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-[#5d2ba3] px-3 py-2">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold text-white bg-[#5d2ba3] hover:bg-[#4a2280] px-4 py-2 rounded-lg transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — compact, typography-first */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
              {t('home.sellWithConfidence')}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
              {t('home.subtitle1')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#5d2ba3] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4a2280] transition"
              >
                Start selling
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                I'm a buyer
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Sell on {t('home.whatsapp')}, {t('home.instagram')}, {t('home.facebook')}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <img src={whatsappImg} alt="" className="h-8 w-8 rounded-lg object-cover opacity-80" />
              <img src={instagramImg} alt="" className="h-8 w-8 rounded-lg object-cover opacity-80" />
              <img src={facebookImg} alt="" className="h-8 w-8 rounded-lg object-cover opacity-80" />
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/50 overflow-hidden">
              <img
                src={heroMainImg}
                alt="Sell on social with PayLoom"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white border-y border-gray-200 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-gray-600 mb-12 max-w-xl">{t('home.subtitle2')}</p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#5d2ba3]/10 flex items-center justify-center">
                <Link2 className="text-[#5d2ba3]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Create</h3>
                <p className="text-sm text-gray-600">
                  {t('home.paymentLink')} or {t('home.storefront')}. Your choice.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#5d2ba3]/10 flex items-center justify-center">
                <MessageCircle className="text-[#5d2ba3]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share</h3>
                <p className="text-sm text-gray-600">
                  Send the link on WhatsApp, Instagram, or anywhere.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#5d2ba3]/10 flex items-center justify-center">
                <Shield className="text-[#5d2ba3]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get paid</h3>
                <p className="text-sm text-gray-600">
                  Payment is held safely until delivery is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-5 py-16 sm:py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Built for social sellers</h2>
        <p className="text-gray-600 mb-12 max-w-xl">{t('home.builtForHowYouSell')}</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: 'Payment protection', text: 'Buyers pay safely. You get paid after delivery.' },
            { title: 'Payment links', text: 'One link per product. No website needed.' },
            { title: 'Storefront', text: 'Full catalog. One shareable link.' },
            { title: 'Multi-currency', text: 'KES, UGX, TZS, RWF.' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-y border-gray-200 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Why PayLoom</h2>
          <ul className="space-y-4">
            {[
              'Payment held securely until the buyer confirms delivery',
              'Share links on WhatsApp, Instagram, Facebook, or DMs',
              'Create links or a store in minutes — no coding',
              "Withdraw to M-Pesa or bank when you're ready",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="shrink-0 text-[#5d2ba3]" size={22} />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-16 sm:py-24">
        <div className="rounded-2xl bg-[#5d2ba3] px-8 py-12 sm:px-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to sell?</h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto">
            Create your account in under a minute. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#5d2ba3] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Create free account
            <ArrowRight size={18} />
          </Link>
          <p className="mt-6 text-sm text-white/80">
            Already have an account? <Link to="/login" className="text-white font-medium underline">Log in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/payloom-logo.jpeg" alt="PayLoom" className="h-6 w-6 rounded object-cover" />
            <span className="font-semibold text-gray-900">PayLoom</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/legal" className="hover:text-gray-900">Legal</Link>
            <a href="/legal#terms" className="hover:text-gray-900">Terms</a>
            <a href="/legal#privacy" className="hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
