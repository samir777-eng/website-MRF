"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  const quickLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.lessons"), href: "/lessons" },
    { name: "التحديات", href: "/challenges" },
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: "عن الأستاذ", href: "/about" },
  ];

  const supportLinks = [
    { name: t("footer.help"), href: "/help" },
    { name: t("footer.contact"), href: "/contact" },
    { name: t("footer.privacy"), href: "/privacy" },
    { name: t("footer.terms"), href: "/terms" },
    { name: "نقاط البيع", href: "/sales-points" },
    { name: "الموزعين", href: "/distributor" },
  ];

  return (
    <footer className="bg-primary-900 dark:bg-primary-950 text-primary-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ر</span>
              </div>
              <span className="font-bold text-xl text-primary-100">
                {t("teacher.name")}
              </span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              {t("teacher.description")}
            </p>
            <nav aria-label="روابط التواصل الاجتماعي">
              <div className="flex space-x-4 rtl:space-x-reverse">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-primary-800 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
                      aria-label={`${social.name} - فتح في نافذة جديدة`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="روابط سريعة">
            <h3 className="font-semibold text-lg text-primary-100">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 mt-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-200 hover:text-primary-100 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="روابط الدعم">
            <h3 className="font-semibold text-lg text-primary-100">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2 mt-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-200 hover:text-primary-100 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary-100">
              {t("footer.contact")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-primary-200 text-sm">
                  info@mrredaelfarouk.com
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-primary-200 text-sm">
                  +20 123 456 7890
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-primary-200 text-sm">
                  {t("footer.location")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-200 text-sm">
              © {new Date().getFullYear()} {t("teacher.name")}.{" "}
              {t("footer.allRightsReserved")}
            </p>
            <nav aria-label="روابط قانونية">
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <a
                  href="/privacy"
                  className="text-primary-200 hover:text-primary-100 transition-colors text-sm"
                >
                  {t("footer.privacy")}
                </a>
                <a
                  href="/terms"
                  className="text-primary-200 hover:text-primary-100 transition-colors text-sm"
                >
                  {t("footer.terms")}
                </a>
                <a
                  href="/cookies"
                  className="text-primary-200 hover:text-primary-100 transition-colors text-sm"
                >
                  {t("footer.cookies")}
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
