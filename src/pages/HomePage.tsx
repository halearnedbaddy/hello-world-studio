import { Link } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useRef } from 'react';

export function HomePage() {
  const { t } = useTranslations();
  const fadeRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addFadeRef = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  return (
    <div className="payloom-landing">
      {/* NAV */}
      <nav className="pl-nav">
        <Link to="/" className="pl-logo">
          Pay<em>Loom</em>
        </Link>
        <div className="pl-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link to="/legal">Legal</Link>
        </div>
        <div className="pl-nav-actions">
          <Link to="/login" className="pl-btn-ghost">
            {t('common.logIn')}
          </Link>
          <Link to="/signup" className="pl-btn-cta">
            {t('common.getStarted')}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pl-hero">
        <div className="pl-hero-inner">
          <div className="pl-hero-content fade-up" ref={addFadeRef}>
            <div className="pl-hero-badge">
              <span className="pl-dot" />
              Live across East Africa
            </div>
            <h1>
              Every Feature You Need to <span className="pl-grad">Sell &amp; Get Paid</span>
            </h1>
            <p>
              From a single payment link to a full storefront — PayLoom gives social sellers and small businesses the tools to collect payments securely and withdraw instantly.
            </p>
            <div className="pl-hero-btns">
              <Link to="/signup" className="pl-btn-hero">
                Start for free
              </Link>
              <a href="#how" className="pl-btn-outline">
                See how it works
              </a>
            </div>
            <div className="pl-hero-stats">
              <div className="pl-hero-stat">
                <div className="pl-num">10K+</div>
                <div className="pl-lbl">Active sellers</div>
              </div>
              <div className="pl-hero-stat">
                <div className="pl-num">KES 50M+</div>
                <div className="pl-lbl">Processed monthly</div>
              </div>
              <div className="pl-hero-stat">
                <div className="pl-num">4</div>
                <div className="pl-lbl">Currencies supported</div>
              </div>
            </div>
          </div>

          <div className="pl-hero-visual fade-up delay-2" ref={addFadeRef}>
            {/* Floating cards */}
            <div className="pl-float-card pl-fc1">
              <div className="pl-fc-icon">📦</div>
              <div className="pl-fc-label">Order delivered</div>
              <div className="pl-fc-value pl-green">+KES 4,200</div>
            </div>
            <div className="pl-float-card pl-fc2">
              <div className="pl-fc-label">Withdrawal sent</div>
              <div className="pl-fc-value">M-Pesa ✓</div>
            </div>
            <div className="pl-float-card pl-fc3">
              <div className="pl-fc-label">Payment link views</div>
              <div className="pl-fc-value">847 today</div>
            </div>

            {/* Phone mockup */}
            <div className="pl-phone-outer">
              <div className="pl-phone-inner">
                <div className="pl-phone-bar">
                  <div className="pl-phone-notch" />
                </div>
                <div className="pl-phone-content">
                  <div className="pl-p-header">
                    <div className="pl-p-avatar">FM</div>
                    <div>
                      <div className="pl-p-title">Fatuma's Fashion</div>
                      <div className="pl-p-sub">payloom.com/fatuma</div>
                    </div>
                  </div>
                  <div className="pl-p-product">
                    <div className="pl-p-img">👗</div>
                    <div className="pl-p-pname">Ankara Wrap Dress</div>
                    <div className="pl-p-price">KES 3,500</div>
                    <button className="pl-p-btn">Pay with M-Pesa →</button>
                  </div>
                  <div className="pl-p-success">
                    <div className="pl-p-success-icon">✓</div>
                    <div className="pl-p-success-text">
                      Payment confirmed!
                      <br />
                      Funds released to seller
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <div className="pl-section" id="features">
        <div className="fade-up" ref={addFadeRef}>
          <div className="pl-section-label">Features</div>
          <div className="pl-section-title">Everything built for how you actually sell</div>
          <div className="pl-section-sub">
            No bloated dashboards. No confusing settings. Just the tools that get you paid.
          </div>
        </div>

        <div className="pl-bento">
          {/* BC1: Payment Links */}
          <div className="pl-bento-card pl-bc1 fade-up" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#ebf0ff' }}>🔗</div>
            <div className="pl-bento-tag" style={{ background: '#ebf0ff', color: '#4361ee' }}>
              Payment Links
            </div>
            <h3>One link. One product. Unlimited sales.</h3>
            <p>
              Create a unique payment link for any product in seconds. Share it on WhatsApp, Instagram, TikTok, or anywhere — no website needed.
            </p>
            <div className="pl-link-demo">
              <span className="pl-link-url">payloom.com/p/ankara-dress-fatuma</span>
              <button className="pl-link-copy">Copy link</button>
            </div>
            <div className="pl-link-channels">
              <div className="pl-channel-pill">💬 WhatsApp</div>
              <div className="pl-channel-pill">📸 Instagram</div>
              <div className="pl-channel-pill">👍 Facebook</div>
              <div className="pl-channel-pill">✉️ Email</div>
              <div className="pl-channel-pill">📱 SMS</div>
            </div>
          </div>

          {/* BC2: Storefront */}
          <div className="pl-bento-card pl-bc2 fade-up delay-1" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#fff3eb' }}>🏪</div>
            <div className="pl-bento-tag" style={{ background: '#fff3eb', color: '#ff6b35' }}>
              Storefront
            </div>
            <h3>Your full catalog, one shareable link</h3>
            <p>
              List all your products under one branded store. Customers browse, pick, and pay — all without leaving their phone.
            </p>
            <div className="pl-store-preview">
              <div className="pl-store-header-bar">
                <div className="pl-store-logo-mini">FM</div>
                <div className="pl-store-name-mini">Fatuma's Fashion Store</div>
              </div>
              <div className="pl-store-grid">
                {[
                  { emoji: '👗', name: 'Ankara Dress', price: 'KES 3,500' },
                  { emoji: '👜', name: 'Leather Bag', price: 'KES 2,800' },
                  { emoji: '💍', name: 'Gold Earrings', price: 'KES 1,200' },
                  { emoji: '🧣', name: 'Silk Scarf', price: 'KES 950' },
                ].map((item, i) => (
                  <div key={i} className="pl-store-item">
                    <div className="pl-store-img">{item.emoji}</div>
                    <div className="pl-store-info">
                      <div className="pl-store-iname">{item.name}</div>
                      <div className="pl-store-iprice">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BC3: Secure Payments */}
          <div className="pl-bento-card pl-bc3 fade-up delay-2" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: 'rgba(6,214,160,0.1)' }}>🔒</div>
            <div className="pl-bento-tag" style={{ background: 'rgba(6,214,160,0.1)', color: '#049a74' }}>
              Secure Payments
            </div>
            <h3>Buyers pay safely. You get paid on delivery.</h3>
            <p>
              Funds are only released to you once the buyer confirms they've received their order. No more chasing payments or fraud.
            </p>
            <div className="pl-payment-flow">
              {[
                { icon: '💳', bg: '#ebf0ff', text: 'Buyer pays via M-Pesa', sub: 'Payment confirmed instantly' },
                { icon: '📦', bg: '#fff3eb', text: 'Seller ships the order', sub: 'Tracking info shared' },
                { icon: '✅', bg: 'rgba(6,214,160,0.1)', text: 'Buyer confirms delivery', sub: 'Funds released to seller' },
              ].map((step, i) => (
                <div key={i} className="pl-flow-step">
                  <div className="pl-flow-icon" style={{ background: step.bg }}>{step.icon}</div>
                  <div>
                    <div className="pl-flow-text">{step.text}</div>
                    <div className="pl-flow-sub">{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BC4: Withdrawals */}
          <div className="pl-bento-card pl-bc4 fade-up delay-1" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#fff3eb' }}>💸</div>
            <div className="pl-bento-tag" style={{ background: '#fff3eb', color: '#ff6b35' }}>
              Instant Withdrawals
            </div>
            <h3>Your money, your way — withdraw anytime</h3>
            <p>
              Once funds are released, withdraw to M-Pesa, Airtel Money, or your bank at any time. M-Pesa withdrawals are typically instant.
            </p>
            <div className="pl-withdrawal-demo">
              <div className="pl-wd-card">
                <div className="pl-wd-icon">📱</div>
                <div className="pl-wd-name">M-Pesa</div>
                <div className="pl-wd-speed pl-wd-instant">Instant</div>
              </div>
              <div className="pl-wd-card">
                <div className="pl-wd-icon">📲</div>
                <div className="pl-wd-name">Airtel Money</div>
                <div className="pl-wd-speed pl-wd-instant">Instant</div>
              </div>
              <div className="pl-balance-bar">
                <div>
                  <div className="pl-bal-label">Available balance</div>
                  <div className="pl-bal-amount">KES 24,750</div>
                </div>
                <button className="pl-bal-btn">Withdraw now</button>
              </div>
            </div>
          </div>

          {/* BC5: Multi-currency */}
          <div className="pl-bento-card pl-bc5 fade-up" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#f5f0ff' }}>💱</div>
            <div className="pl-bento-tag" style={{ background: '#f5f0ff', color: '#7b2d8b' }}>
              Multi-Currency
            </div>
            <h3>Sell across East Africa</h3>
            <p>Accept payments in 4 currencies and reach customers across the region.</p>
            <div className="pl-currency-list">
              {[
                { flag: '🇰🇪', code: 'KES', name: 'Kenyan Shilling' },
                { flag: '🇺🇬', code: 'UGX', name: 'Ugandan Shilling' },
                { flag: '🇹🇿', code: 'TZS', name: 'Tanzanian Shilling' },
                { flag: '🇷🇼', code: 'RWF', name: 'Rwandan Franc' },
              ].map((c, i) => (
                <div key={i} className="pl-curr-item">
                  <span className="pl-curr-flag">{c.flag}</span>
                  <div>
                    <div className="pl-curr-code">{c.code}</div>
                    <div className="pl-curr-name">{c.name}</div>
                  </div>
                  <span className="pl-curr-rate">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* BC6: Dispute Resolution */}
          <div className="pl-bento-card pl-bc6 fade-up delay-1" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#e8f8ff' }}>⚖️</div>
            <div className="pl-bento-tag" style={{ background: '#e8f8ff', color: '#006fa8' }}>
              Dispute Resolution
            </div>
            <h3>Fair. Fast. Binding.</h3>
            <p>Issues resolved within 48 hours by our compliance team. Evidence-based decisions protect both sides.</p>
            <div className="pl-dispute-meter">
              <div className="pl-dm-row">
                <span className="pl-dm-label">Resolution rate</span>
                <span className="pl-dm-val">98.4%</span>
              </div>
              <div className="pl-dm-bar-bg">
                <div className="pl-dm-bar-fill" style={{ width: '98.4%' }} />
              </div>
              <div className="pl-dm-row">
                <span className="pl-dm-label">Avg resolution time</span>
                <span className="pl-dm-val">26 hrs</span>
              </div>
              <div className="pl-dm-bar-bg">
                <div className="pl-dm-bar-fill" style={{ width: '65%', background: 'linear-gradient(90deg,#4361ee,#7b2d8b)' }} />
              </div>
            </div>
          </div>

          {/* BC7: Analytics */}
          <div className="pl-bento-card pl-bc7 fade-up delay-2" ref={addFadeRef}>
            <div className="pl-bento-icon" style={{ background: '#fff5e6' }}>📊</div>
            <div className="pl-bento-tag" style={{ background: '#fff5e6', color: '#b45309' }}>
              Analytics
            </div>
            <h3>Know your numbers</h3>
            <p>Real-time sales data, link performance, and payout history — all in one dashboard.</p>
            <div className="pl-analytics-mini">
              {[
                { color: '#4361ee', label: 'Sales today', val: 'KES 18,200' },
                { color: '#06d6a0', label: 'Link clicks', val: '342' },
                { color: '#ff6b35', label: 'Conversion rate', val: '24.6%' },
              ].map((row, i) => (
                <div key={i} className="pl-an-row">
                  <div className="pl-an-dot" style={{ background: row.color }} />
                  <div className="pl-an-label">{row.label}</div>
                  <div className="pl-an-val">{row.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="pl-how-section" id="how">
        <div className="pl-how-inner">
          <div className="fade-up" ref={addFadeRef}>
            <div className="pl-section-label" style={{ color: '#06d6a0' }}>How it works</div>
            <div className="pl-section-title" style={{ color: '#fff', maxWidth: 600 }}>
              Three steps. First sale in minutes.
            </div>
            <div className="pl-section-sub" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3.5rem' }}>
              No setup fees. No complicated onboarding. Just create, share, and get paid.
            </div>
          </div>
          <div className="pl-how-steps">
            {[
              {
                num: '1',
                title: 'Create your link or store',
                text: 'Add your product name, price, and photo. Generate a payment link or a full storefront — your choice, no coding needed.',
              },
              {
                num: '2',
                title: 'Share with your customers',
                text: 'Drop the link in your WhatsApp chats, Instagram bio, Facebook page, or anywhere your customers are already browsing.',
              },
              {
                num: '3',
                title: 'Get paid, withdraw instantly',
                text: 'Buyer pays, confirms delivery, and funds land in your PayLoom account. Withdraw to M-Pesa anytime — typically instant.',
              },
            ].map((step, i) => (
              <div key={i} className={`pl-how-step fade-up${i > 0 ? ` delay-${i}` : ''}`} ref={addFadeRef}>
                <div className="pl-how-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="pl-how-visual fade-up delay-1" ref={addFadeRef}>
            <div className="pl-hv-step">
              <div className="pl-hv-icon">👗</div>
              <div className="pl-hv-label">Buyer sees</div>
              <div className="pl-hv-value">Product &amp; price</div>
            </div>
            <div className="pl-how-vis-divider" />
            <div className="pl-hv-step">
              <div className="pl-hv-icon">📱</div>
              <div className="pl-hv-label">Buyer pays via</div>
              <div className="pl-hv-value">M-Pesa STK Push</div>
            </div>
            <div className="pl-how-vis-divider" />
            <div className="pl-hv-step">
              <div className="pl-hv-icon">✅</div>
              <div className="pl-hv-label">Delivery confirmed</div>
              <div className="pl-hv-value">Funds released</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="pl-proof-section">
        <div className="pl-proof-inner">
          <div className="fade-up" ref={addFadeRef} style={{ textAlign: 'center' }}>
            <div className="pl-section-label" style={{ textAlign: 'center' }}>Trusted by sellers</div>
            <div className="pl-section-title" style={{ margin: '0 auto 0.8rem', textAlign: 'center' }}>
              Sellers across East Africa love PayLoom
            </div>
            <div className="pl-section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
              Real stories from real businesses growing with PayLoom.
            </div>
          </div>
          <div className="pl-proof-grid">
            {[
              {
                text: '"I used to lose sales because buyers didn\'t trust me. With PayLoom, my conversion rate doubled in the first week. The payment link just works."',
                initials: 'FW',
                bg: 'linear-gradient(135deg,#4361ee,#7b2d8b)',
                name: 'Fatuma Wanjiku',
                role: 'Fashion seller, Nairobi',
              },
              {
                text: '"Setting up my storefront took 10 minutes. Now my WhatsApp bio has one link and customers browse all my products and pay instantly."',
                initials: 'BM',
                bg: 'linear-gradient(135deg,#06d6a0,#00b4d8)',
                name: 'Brian Mutua',
                role: 'Electronics trader, Mombasa',
              },
              {
                text: '"M-Pesa withdrawals really are instant. I sold something at midnight and withdrew the money straight away. No waiting, no stress."',
                initials: 'AK',
                bg: 'linear-gradient(135deg,#ff6b35,#ffd60a)',
                name: 'Amina Kamau',
                role: 'Handmade crafts, Kisumu',
              },
            ].map((card, i) => (
              <div key={i} className={`pl-proof-card fade-up${i > 0 ? ` delay-${i}` : ''}`} ref={addFadeRef}>
                <div className="pl-proof-stars">★★★★★</div>
                <p>{card.text}</p>
                <div className="pl-proof-author">
                  <div className="pl-proof-av" style={{ background: card.bg }}>
                    {card.initials}
                  </div>
                  <div>
                    <div className="pl-proof-name">{card.name}</div>
                    <div className="pl-proof-role">{card.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pl-cta-section">
        <div className="pl-cta-inner fade-up" ref={addFadeRef}>
          <h2>Ready to start selling with confidence?</h2>
          <p>Join thousands of sellers across East Africa. Create your free PayLoom account in under a minute.</p>
          <div className="pl-cta-btns">
            <Link to="/signup" className="pl-btn-cta-white">
              Create free account
            </Link>
            <Link to="/login" className="pl-btn-cta-ghost">
              I'm a buyer
            </Link>
          </div>
          <div className="pl-cta-note">
            {t('home.alreadyHaveAccount')}{' '}
            <Link to="/login">{t('common.logIn')}</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pl-footer">
        <div className="pl-f-logo">
          Pay<em>Loom</em>
        </div>
        <div className="pl-f-links">
          <Link to="/legal">Legal</Link>
          <a href="/legal#terms">Terms</a>
          <a href="/legal#privacy">Privacy</a>
        </div>
        <div className="pl-f-copy">© 2026 PayLoom</div>
      </footer>
    </div>
  );
}
