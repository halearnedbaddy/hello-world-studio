import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldIcon, FileTextIcon, LockIcon, GlobeIcon } from '@/components/icons';

export function LegalPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-semibold">
                    <ArrowLeftIcon size={20} /> Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-[#3d1a7a] mb-2">Legal & Security Center</h1>
                    <p className="text-gray-500 mb-10 text-sm">Last updated: February 6, 2026</p>

                    {/* Table of Contents */}
                    <nav className="bg-gray-50 rounded-xl p-5 mb-10">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contents</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#terms" className="text-[#5d2ba3] hover:underline">1. Terms of Service</a></li>
                            <li><a href="#privacy" className="text-[#5d2ba3] hover:underline">2. Privacy Policy</a></li>
                            <li><a href="#security" className="text-[#5d2ba3] hover:underline">3. Security Policy</a></li>
                            <li><a href="#payment" className="text-[#5d2ba3] hover:underline">4. Payment Terms</a></li>
                            <li><a href="#disputes" className="text-[#5d2ba3] hover:underline">5. Dispute Resolution</a></li>
                            <li><a href="#contact" className="text-[#5d2ba3] hover:underline">6. Contact Us</a></li>
                        </ul>
                    </nav>

                    <div className="space-y-14">
                        {/* Terms of Service */}
                        <section id="terms">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <FileTextIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">1. Terms of Service</h2>
                            </div>

                            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                                <h3 className="font-semibold text-gray-800">1.1 Acceptance of Terms</h3>
                                <p>By accessing or using PayLoom ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform. PayLoom reserves the right to modify these terms at any time, with changes effective upon posting.</p>

                                <h3 className="font-semibold text-gray-800">1.2 Eligibility</h3>
                                <p>You must be at least 18 years of age to use PayLoom. By registering, you confirm that you are of legal age to enter binding contracts in your jurisdiction and that all information you provide is accurate and truthful.</p>

                                <h3 className="font-semibold text-gray-800">1.3 Account Responsibilities</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                                    <li>You must notify us immediately of any unauthorized access to your account.</li>
                                    <li>You may not create multiple accounts or use another person's account without authorization.</li>
                                    <li>PayLoom is not liable for losses resulting from unauthorized use of your account.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">1.4 Acceptable Use</h3>
                                <p>You agree not to use PayLoom for:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Fraudulent, deceptive, or illegal activities.</li>
                                    <li>Selling prohibited goods including drugs, weapons, counterfeit items, or stolen property.</li>
                                    <li>Money laundering, terrorism financing, or any financial crime.</li>
                                    <li>Harassment, abuse, or intimidation of other users.</li>
                                    <li>Manipulating prices, reviews, or platform features.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">1.5 Account Suspension & Termination</h3>
                                <p>PayLoom reserves the right to suspend or permanently terminate any account that violates these terms, is involved in suspicious activity, or poses a risk to the platform's integrity. Any pending payments during suspension will be handled per our Dispute Resolution process.</p>

                                <h3 className="font-semibold text-gray-800">1.6 Platform Fees</h3>
                                <p>PayLoom charges a platform fee on each completed transaction. The fee is deducted from the seller's payout at the time of payment processing. Current fee rates are displayed during transaction creation and may be updated with prior notice.</p>

                                <h3 className="font-semibold text-gray-800">1.7 Limitation of Liability</h3>
                                <p>PayLoom acts solely as a payment facilitation platform. We are not responsible for the quality, legality, or delivery of goods or services exchanged between buyers and sellers. Our liability is limited to the platform fees collected.</p>
                            </div>
                        </section>

                        {/* Privacy Policy */}
                        <section id="privacy">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <LockIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">2. Privacy Policy</h2>
                            </div>

                            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                                <h3 className="font-semibold text-gray-800">2.1 Information We Collect</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Personal Data:</strong> Name, email address, phone number, and profile picture provided during registration.</li>
                                    <li><strong>Financial Data:</strong> M-Pesa number, bank account details, and transaction history required for payment processing.</li>
                                    <li><strong>Usage Data:</strong> IP address, browser type, device information, and interaction logs to improve our services.</li>
                                    <li><strong>Communication Data:</strong> Messages exchanged through dispute resolution channels.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">2.2 How We Use Your Information</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>To facilitate secure transactions and payment processing.</li>
                                    <li>To verify identity and prevent fraud.</li>
                                    <li>To process withdrawals and payouts.</li>
                                    <li>To send transaction notifications and important updates.</li>
                                    <li>To resolve disputes between buyers and sellers.</li>
                                    <li>To comply with legal and regulatory requirements.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">2.3 Data Sharing</h3>
                                <p>We do <strong>not</strong> sell your personal information to third parties. We may share data with:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Payment processors (M-Pesa, Airtel Money) to complete transactions.</li>
                                    <li>Law enforcement when required by court order or to prevent fraud.</li>
                                    <li>Service providers who assist in operating the platform under strict confidentiality agreements.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">2.4 Data Retention</h3>
                                <p>We retain your data for as long as your account is active and for a reasonable period thereafter to comply with legal obligations, resolve disputes, and enforce agreements. Transaction records are kept for a minimum of 7 years.</p>

                                <h3 className="font-semibold text-gray-800">2.5 Your Rights</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Access and download a copy of your personal data.</li>
                                    <li>Request correction of inaccurate information.</li>
                                    <li>Request deletion of your account and associated data (subject to legal retention requirements).</li>
                                    <li>Withdraw consent for optional data processing at any time.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">2.6 Cookies</h3>
                                <p>PayLoom uses essential cookies for authentication and session management. No third-party tracking cookies are used without your explicit consent.</p>
                            </div>
                        </section>

                        {/* Security Policy */}
                        <section id="security">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <ShieldIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">3. Security Policy</h2>
                            </div>

                            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                                <h3 className="font-semibold text-gray-800">3.1 Data Encryption</h3>
                                <p>All data transmitted between your device and PayLoom servers is encrypted using TLS 1.3. Sensitive data at rest is protected with AES-256 encryption. Payment credentials are never stored on our servers — they are tokenized through our payment partners.</p>

                                <h3 className="font-semibold text-gray-800">3.2 Authentication Security</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Phone-based OTP verification for account access.</li>
                                    <li>Passwords are hashed using bcrypt with unique salts.</li>
                                    <li>Automatic account lockout after multiple failed login attempts.</li>
                                    <li>Session tokens expire after periods of inactivity.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">3.3 Payment Protection</h3>
                                <p>All payments processed through PayLoom are handled via licensed payment partners. Funds are routed securely and transparently, with real-time transaction records available to both parties.</p>

                                <h3 className="font-semibold text-gray-800">3.4 Fraud Prevention</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Real-time transaction monitoring for suspicious patterns.</li>
                                    <li>Automated flagging of high-risk activities.</li>
                                    <li>Manual review by our compliance team for flagged transactions.</li>
                                    <li>IP-based anomaly detection for login attempts.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">3.5 Reporting Vulnerabilities</h3>
                                <p>If you discover a security vulnerability, please report it to <strong>security@payloom.com</strong>. We investigate all reports promptly and will not take legal action against good-faith security researchers.</p>
                            </div>
                        </section>

                        {/* Payment Terms */}
                        <section id="payment">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <GlobeIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">4. Payment Terms</h2>
                            </div>

                            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                                <h3 className="font-semibold text-gray-800">4.1 How Payments Work</h3>
                                <ol className="list-decimal pl-6 space-y-1">
                                    <li>The seller creates a payment link or lists a product on their storefront.</li>
                                    <li>The buyer makes payment via their preferred payment method.</li>
                                    <li>The seller fulfills the order and provides tracking or delivery proof.</li>
                                    <li>The buyer confirms receipt and satisfaction.</li>
                                    <li>Funds are released to the seller's account, minus the platform fee.</li>
                                </ol>

                                <h3 className="font-semibold text-gray-800">4.2 Auto-Release</h3>
                                <p>If the buyer does not confirm or dispute delivery within 72 hours of the seller marking the item as delivered, funds may be automatically released to the seller. Buyers are notified before auto-release occurs.</p>

                                <h3 className="font-semibold text-gray-800">4.3 Supported Payment Methods</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>M-Pesa:</strong> Payments and withdrawals via Safaricom M-Pesa.</li>
                                    <li><strong>Airtel Money:</strong> Payments and withdrawals via Airtel Money.</li>
                                    <li><strong>Bank Transfer:</strong> Withdrawals to supported Kenyan and international banks.</li>
                                    <li><strong>Card Payments:</strong> Visa and Mastercard.</li>
                                </ul>

                                <h3 className="font-semibold text-gray-800">4.4 Withdrawals</h3>
                                <p>Sellers can withdraw available funds from their PayLoom account to M-Pesa, Airtel Money, or a bank account. Withdrawal processing times vary: M-Pesa and Airtel Money withdrawals are typically instant; bank transfers may take 1–3 business days. A small processing fee may apply.</p>

                                <h3 className="font-semibold text-gray-800">4.5 Refunds</h3>
                                <p>Refunds are issued to the buyer's original payment method when a dispute is resolved in the buyer's favor, when the seller cancels an order, or when an order expires without shipment. Refund processing takes 5–10 business days.</p>
                            </div>
                        </section>

                        {/* Dispute Resolution */}
                        <section id="disputes">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <ShieldIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">5. Dispute Resolution</h2>
                            </div>

                            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                                <h3 className="font-semibold text-gray-800">5.1 Filing a Dispute</h3>
                                <p>Either party may file a dispute if they believe the transaction terms have not been met. Disputes must be filed within 7 days of the delivery date (or expected delivery date). To file a dispute, provide a description, evidence (photos, screenshots, messages), and the desired resolution.</p>

                                <h3 className="font-semibold text-gray-800">5.2 Resolution Process</h3>
                                <ol className="list-decimal pl-6 space-y-1">
                                    <li><strong>Review:</strong> Our compliance team reviews all submitted evidence within 48 hours.</li>
                                    <li><strong>Mediation:</strong> Both parties are given a chance to present their case via secure messaging.</li>
                                    <li><strong>Decision:</strong> PayLoom issues a binding decision based on the evidence.</li>
                                    <li><strong>Resolution:</strong> Funds are released to the appropriate party or refunded.</li>
                                </ol>

                                <h3 className="font-semibold text-gray-800">5.3 Dispute Deadlines</h3>
                                <p>Each party has 48 hours to respond to a dispute inquiry. Failure to respond may result in the dispute being resolved in favor of the responding party. Extensions may be granted in exceptional circumstances.</p>

                                <h3 className="font-semibold text-gray-800">5.4 Final Decisions</h3>
                                <p>PayLoom's dispute resolution decisions are final and binding. In cases of significant value or complexity, PayLoom may refer the matter to an independent arbitrator at its discretion.</p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section id="contact">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#5d2ba3]/15 rounded-lg flex items-center justify-center text-[#5d2ba3]">
                                    <GlobeIcon size={22} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#3d1a7a]">6. Contact Us</h2>
                            </div>

                            <div className="text-gray-600 leading-relaxed text-[15px] space-y-2">
                                <p>If you have questions about these terms or need assistance, reach out to us:</p>
                                <ul className="list-none space-y-2 mt-3">
                                    <li>📧 <strong>Email:</strong> verdioharun@gmail.com</li>
                                    <li>📞 <strong>Phone:</strong> +254705448355</li>
                                    <li>💬 <strong>In-App Support:</strong> Available from your dashboard under "Support"</li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-400">© {new Date().getFullYear()} PayLoom. All rights reserved.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
