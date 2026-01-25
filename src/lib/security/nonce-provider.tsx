"use client";

import { createContext, useContext, ReactNode } from "react";

interface NonceContextType {
  nonce: string | null;
}

const NonceContext = createContext<NonceContextType>({ nonce: null });

interface NonceProviderProps {
  children: ReactNode;
  nonce?: string;
}

/**
 * Provider for CSP nonce values
 * Allows components to access the nonce for inline scripts and styles
 */
export function NonceProvider({ children, nonce }: NonceProviderProps) {
  return (
    <NonceContext.Provider value={{ nonce: nonce || null }}>
      {children}
    </NonceContext.Provider>
  );
}

/**
 * Hook to access the current CSP nonce
 */
export function useNonce(): string | null {
  const { nonce } = useContext(NonceContext);
  return nonce;
}

/**
 * Component for adding nonce to inline scripts
 */
interface NonceScriptProps {
  children: string;
  id?: string;
}

export function NonceScript({ children, id }: NonceScriptProps) {
  const nonce = useNonce();

  return (
    <script
      id={id}
      nonce={nonce || undefined}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

/**
 * Component for adding nonce to inline styles
 */
interface NonceStyleProps {
  children: string;
  id?: string;
}

export function NonceStyle({ children, id }: NonceStyleProps) {
  const nonce = useNonce();

  return (
    <style
      id={id}
      nonce={nonce || undefined}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

/**
 * Higher-order component to wrap components that need nonce
 */
export function withNonce<P extends object>(
  Component: React.ComponentType<P & { nonce?: string }>,
) {
  return function NonceWrappedComponent(props: P) {
    const nonce = useNonce();
    return <Component {...props} nonce={nonce || undefined} />;
  };
}

/**
 * Utility function to create CSP-safe inline event handlers
 */
export function createSafeEventHandler(
  handler: string,
  nonce?: string,
): string {
  if (!nonce) {
    console.warn("No nonce available for inline event handler");
    return "";
  }

  return `javascript:void(0);/* nonce: ${nonce} */ ${handler}`;
}

/**
 * Component for CSP-safe analytics scripts
 */
interface AnalyticsScriptProps {
  trackingId?: string;
  debug?: boolean;
}

export function AnalyticsScript({
  trackingId,
  debug = false,
}: AnalyticsScriptProps) {
  const nonce = useNonce();

  if (!trackingId || process.env.NODE_ENV !== "production") {
    return null;
  }

  const analyticsScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}', {
      debug_mode: ${debug}
    });
  `;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        nonce={nonce || undefined}
      />
      <NonceScript id="gtag-config">{analyticsScript}</NonceScript>
    </>
  );
}

/**
 * Component for CSP-safe service worker registration
 */
interface ServiceWorkerScriptProps {
  swPath?: string;
  scope?: string;
}

export function ServiceWorkerScript({
  swPath = "/sw.js",
  scope = "/",
}: ServiceWorkerScriptProps) {
  const _nonce = useNonce();

  const swScript = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('${swPath}', {
          scope: '${scope}'
        }).then(function(registration) {
          console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  `;

  return <NonceScript id="service-worker-registration">{swScript}</NonceScript>;
}

/**
 * Component for CSP-safe theme initialization
 */
export function ThemeScript() {
  const _nonce = useNonce();

  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        console.warn('Theme initialization failed:', e);
      }
    })();
  `;

  return <NonceScript id="theme-initialization">{themeScript}</NonceScript>;
}

/**
 * Component for CSP-safe critical CSS
 */
interface CriticalCSSProps {
  css: string;
}

export function CriticalCSS({ css }: CriticalCSSProps) {
  const _nonce = useNonce();

  return <NonceStyle id="critical-css">{css}</NonceStyle>;
}

/**
 * Utility to validate nonce format
 */
export function isValidNonce(nonce: string): boolean {
  // Base64 nonce should be at least 16 characters
  return /^[A-Za-z0-9+/]{16,}={0,2}$/.test(nonce);
}

/**
 * Development helper to check CSP compliance
 * Note: This should be called from within a React component
 */
export function useCSPCompliance() {
  const nonce = useNonce();

  if (process.env.NODE_ENV !== "development") return;

  console.group("🔒 CSP Compliance Check");
  console.log("Nonce available:", !!nonce);
  console.log("Nonce valid:", nonce ? isValidNonce(nonce) : false);
  console.log("Nonce value:", nonce ? `${nonce.substring(0, 8)}...` : "none");

  // Check for unsafe inline content
  const inlineScripts = document.querySelectorAll(
    "script:not([src]):not([nonce])",
  );
  const inlineStyles = document.querySelectorAll("style:not([nonce])");

  if (inlineScripts.length > 0) {
    console.warn("Found inline scripts without nonce:", inlineScripts);
  }

  if (inlineStyles.length > 0) {
    console.warn("Found inline styles without nonce:", inlineStyles);
  }

  console.groupEnd();
}
