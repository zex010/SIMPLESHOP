import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "Information We Collect",
    body:
      "We collect information you provide directly to us, such as your name, email address, shipping address, and payment details when you create an account, place an order, or contact customer care. We also automatically collect certain information about your device and how you interact with our site, including IP address, browser type, and pages visited.",
  },
  {
    title: "How We Use Your Information",
    body:
      "We use your information to process orders, provide customer support, personalize your shopping experience, send order updates, and — where you have opted in — share news about new fragrances and private offers. We never sell your personal information to third parties.",
  },
  {
    title: "Cookies & Tracking",
    body:
      "Our site uses cookies to keep you signed in, remember items in your cart and wishlist, and understand how visitors use our boutique so we can improve it. You can control cookies through your browser settings, though some features may not function correctly if cookies are disabled.",
  },
  {
    title: "Sharing Your Information",
    body:
      "We share information with trusted service providers who help us operate our business, such as payment processors and shipping carriers, strictly for the purpose of fulfilling your order. These providers are contractually obligated to protect your data.",
  },
  {
    title: "Data Security",
    body:
      "We use industry-standard safeguards to protect your personal information, including encrypted transmission of payment details. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body:
      "You may access, correct, or request deletion of your personal information at any time by contacting our customer care team. You may also unsubscribe from marketing communications using the link included in any newsletter email.",
  },
  {
    title: "Changes To This Policy",
    body:
      "We may update this privacy policy from time to time to reflect changes in our practices. We encourage you to review this page periodically for the latest information on our privacy practices.",
  },
  {
    title: "Contact Us",
    body:
      "If you have any questions about this privacy policy or how we handle your information, please reach out to us at avernusparfums@gmail.com or through the Contact Us panel available throughout the site.",
  },
];

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[45vh] flex items-center justify-center border-b border-stone-100">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500 mb-8">
            MAISON AVERNUS
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-[0.15em]">
            PRIVACY POLICY
          </h1>
          <p className="mt-8 text-stone-500 tracking-[0.3em] uppercase text-sm">
            Last Updated August 2026
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-16 py-20 max-w-3xl mx-auto">
        <p className="text-stone-600 leading-relaxed">
          MAISON AVERNUS ("we," "our," or "us") respects your privacy
          and is committed to protecting it through our compliance with this
          policy. This policy describes the types of information we may
          collect from you, or that you may provide, when you visit our site
          or make a purchase, and our practices for collecting, using,
          maintaining, protecting, and disclosing that information.
        </p>

        <div className="mt-14 space-y-12">
          {SECTIONS.map((section, index) => (
            <div key={section.title} className="border-t border-stone-200 pt-8">
              <p className="uppercase tracking-[0.3em] text-[11px] text-stone-400 mb-2">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl">
                {section.title}
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;