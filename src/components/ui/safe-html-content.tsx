"use client";

import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";

// Define a simpler config type to avoid DOMPurify type issues
interface SimplePurifyConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
  ADD_ATTR?: string[];
}

interface SafeHtmlContentProps {
  html: string;
  className?: string;
  /**
   * Replace newlines with <br/> tags before sanitization
   * @default true
   */
  preserveNewlines?: boolean;
  /**
   * Custom DOMPurify configuration
   */
  purifyConfig?: SimplePurifyConfig;
}

// Default DOMPurify config - allows safe HTML tags
const defaultConfig: SimplePurifyConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "b",
    "i",
    "em",
    "strong",
    "u",
    "s",
    "strike",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "span",
    "div",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "figure",
    "figcaption",
    "hr",
    "sup",
    "sub",
  ],
  ALLOWED_ATTR: [
    "href",
    "title",
    "alt",
    "src",
    "class",
    "id",
    "target",
    "rel",
    "width",
    "height",
    "colspan",
    "rowspan",
  ],
  // Force safe link handling
  ALLOW_DATA_ATTR: false,
  // Add rel="noopener noreferrer" to all links
  ADD_ATTR: ["target"],
};

/**
 * SafeHtmlContent - Renders HTML content safely by sanitizing with DOMPurify
 *
 * SECURITY: This component prevents XSS attacks by sanitizing all HTML content
 * before rendering it with dangerouslySetInnerHTML.
 *
 * NOTE: Uses useEffect to only sanitize on client side (DOMPurify requires DOM)
 *
 * @example
 * <SafeHtmlContent html={userGeneratedContent} />
 * <SafeHtmlContent html={lessonNotes} preserveNewlines={true} />
 */
export function SafeHtmlContent({
  html,
  className,
  preserveNewlines = true,
  purifyConfig,
}: SafeHtmlContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sanitizedHtml = useMemo(() => {
    // Only sanitize on client side
    if (!mounted || typeof window === "undefined") return "";
    if (!html) return "";

    // Replace newlines with <br/> if enabled
    const processedHtml = preserveNewlines
      ? html.replace(/\n/g, "<br/>")
      : html;

    // Merge with custom config if provided
    const config = purifyConfig
      ? { ...defaultConfig, ...purifyConfig }
      : defaultConfig;

    // Sanitize the HTML - DOMPurify is available on client
    const sanitized = DOMPurify.sanitize(processedHtml, config);

    return sanitized;
  }, [html, preserveNewlines, purifyConfig, mounted]);

  // Render empty div on server and initial client render
  // This ensures consistent HTML between server and client
  return (
    <div
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: mounted ? sanitizedHtml : "" }}
    />
  );
}

export default SafeHtmlContent;
