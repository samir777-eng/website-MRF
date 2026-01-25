"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Palette, Type, Layout, Zap } from "lucide-react";

interface ColorPalette {
  name: string;
  colors: Array<{
    name: string;
    value: string;
    cssVar: string;
    description: string;
  }>;
}

interface TypographyScale {
  name: string;
  size: string;
  lineHeight: string;
  fontWeight: string;
  cssClass: string;
  usage: string;
}

interface SpacingScale {
  name: string;
  value: string;
  pixels: string;
  usage: string;
}

export function DesignSystem() {
  const colorPalettes: ColorPalette[] = [
    {
      name: "Primary Colors",
      colors: [
        {
          name: "Primary",
          value: "hsl(222.2 84% 4.9%)",
          cssVar: "--primary",
          description: "Main brand color",
        },
        {
          name: "Primary Foreground",
          value: "hsl(210 40% 98%)",
          cssVar: "--primary-foreground",
          description: "Text on primary",
        },
        {
          name: "Secondary",
          value: "hsl(210 40% 96%)",
          cssVar: "--secondary",
          description: "Secondary actions",
        },
        {
          name: "Secondary Foreground",
          value: "hsl(222.2 84% 4.9%)",
          cssVar: "--secondary-foreground",
          description: "Text on secondary",
        },
      ],
    },
    {
      name: "Neutral Colors",
      colors: [
        {
          name: "Background",
          value: "hsl(0 0% 100%)",
          cssVar: "--background",
          description: "Page background",
        },
        {
          name: "Foreground",
          value: "hsl(222.2 84% 4.9%)",
          cssVar: "--foreground",
          description: "Main text color",
        },
        {
          name: "Muted",
          value: "hsl(210 40% 96%)",
          cssVar: "--muted",
          description: "Subtle backgrounds",
        },
        {
          name: "Muted Foreground",
          value: "hsl(215.4 16.3% 46.9%)",
          cssVar: "--muted-foreground",
          description: "Muted text",
        },
      ],
    },
    {
      name: "Status Colors",
      colors: [
        {
          name: "Destructive",
          value: "hsl(0 84.2% 60.2%)",
          cssVar: "--destructive",
          description: "Error states",
        },
        {
          name: "Destructive Foreground",
          value: "hsl(210 40% 98%)",
          cssVar: "--destructive-foreground",
          description: "Text on destructive",
        },
        {
          name: "Border",
          value: "hsl(214.3 31.8% 91.4%)",
          cssVar: "--border",
          description: "Component borders",
        },
        {
          name: "Input",
          value: "hsl(214.3 31.8% 91.4%)",
          cssVar: "--input",
          description: "Input borders",
        },
      ],
    },
  ];

  const typographyScale: TypographyScale[] = [
    {
      name: "Heading 1",
      size: "2.25rem",
      lineHeight: "2.5rem",
      fontWeight: "800",
      cssClass: "text-4xl font-extrabold",
      usage: "Page titles",
    },
    {
      name: "Heading 2",
      size: "1.875rem",
      lineHeight: "2.25rem",
      fontWeight: "700",
      cssClass: "text-3xl font-bold",
      usage: "Section titles",
    },
    {
      name: "Heading 3",
      size: "1.5rem",
      lineHeight: "2rem",
      fontWeight: "600",
      cssClass: "text-2xl font-semibold",
      usage: "Subsection titles",
    },
    {
      name: "Heading 4",
      size: "1.25rem",
      lineHeight: "1.75rem",
      fontWeight: "600",
      cssClass: "text-xl font-semibold",
      usage: "Card titles",
    },
    {
      name: "Body Large",
      size: "1.125rem",
      lineHeight: "1.75rem",
      fontWeight: "400",
      cssClass: "text-lg",
      usage: "Large body text",
    },
    {
      name: "Body",
      size: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "400",
      cssClass: "text-base",
      usage: "Default body text",
    },
    {
      name: "Body Small",
      size: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "400",
      cssClass: "text-sm",
      usage: "Small text, captions",
    },
    {
      name: "Caption",
      size: "0.75rem",
      lineHeight: "1rem",
      fontWeight: "400",
      cssClass: "text-sm",
      usage: "Labels, metadata",
    },
  ];

  const spacingScale: SpacingScale[] = [
    { name: "xs", value: "0.25rem", pixels: "4px", usage: "Tight spacing" },
    { name: "sm", value: "0.5rem", pixels: "8px", usage: "Small gaps" },
    { name: "md", value: "1rem", pixels: "16px", usage: "Default spacing" },
    { name: "lg", value: "1.5rem", pixels: "24px", usage: "Large spacing" },
    { name: "xl", value: "2rem", pixels: "32px", usage: "Section spacing" },
    { name: "2xl", value: "3rem", pixels: "48px", usage: "Page spacing" },
    { name: "3xl", value: "4rem", pixels: "64px", usage: "Large sections" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Design System</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive guide to the visual language, components, and patterns
          used throughout the MRF Educational Platform.
        </p>
      </div>

      {/* Color Palette */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Color Palette</h2>
        </div>

        <div className="grid gap-6">
          {colorPalettes.map((palette) => (
            <Card key={palette.name}>
              <CardHeader>
                <CardTitle className="text-lg">{palette.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {palette.colors.map((color) => (
                    <div key={color.name} className="space-y-3">
                      <div
                        className="w-full h-20 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{color.name}</div>
                        <div className="text-sm text-gray-500">
                          {color.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {color.cssVar}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color.value)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <code className="text-sm text-gray-600 block">
                          {color.value}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Typography */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Type className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Typography</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Type Scale</CardTitle>
            <CardDescription>
              Consistent typography hierarchy for clear information structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {typographyScale.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className={type.cssClass}>{type.name} Sample Text</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {type.usage}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-mono">
                      {type.size} / {type.lineHeight}
                    </div>
                    <div className="text-sm text-gray-500">
                      Weight: {type.fontWeight}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(type.cssClass)}
                      className="h-6"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Spacing */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layout className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Spacing Scale</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Spacing System</CardTitle>
            <CardDescription>
              Consistent spacing values for layouts and components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spacingScale.map((spacing) => (
                <div
                  key={spacing.name}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="bg-blue-200 rounded"
                      style={{
                        width: spacing.value,
                        height: "1rem",
                        minWidth: "4px",
                      }}
                    />
                    <div>
                      <div className="font-medium">{spacing.name}</div>
                      <div className="text-sm text-gray-500">
                        {spacing.usage}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{spacing.value}</div>
                    <div className="text-sm text-gray-500">
                      {spacing.pixels}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Design Principles */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Design Principles</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accessibility First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All components are built with accessibility in mind, supporting
                screen readers, keyboard navigation, and WCAG 2.1 AA compliance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Components adapt seamlessly across all device sizes using
                mobile-first responsive design principles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consistent Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Reusable patterns and components ensure consistency across the
                entire platform and reduce cognitive load.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Components are optimized for performance with minimal bundle
                size, efficient rendering, and fast load times.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
