"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code,
  Copy,
  Eye,
  Info,
  Palette,
  Search,
  Settings,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ComponentVariant {
  name: string;
  props: Record<string, unknown>;
  description: string;
}

interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  componentType: string;
  props?: Record<string, unknown>;
  code: string;
  usage: string;
  variants?: ComponentVariant[];
}

interface ComponentCatalogProps {
  components: ComponentExample[];
  className?: string;
}

export function ComponentCatalog({
  components,
  className = "",
}: ComponentCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentExample | null>(null);
  const [activeTab, setActiveTab] = useState("preview");

  // Get unique categories
  const categories = ["all", ...new Set(components.map((c) => c.category))];

  // Filter components
  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || component.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const renderComponent = (
    example: ComponentExample,
    variant?: ComponentVariant,
  ) => {
    const props = variant
      ? { ...example.props, ...variant.props }
      : example.props;

    try {
      switch (example.componentType) {
        case "Button":
          return <Button {...props} />;
        case "Badge":
          return <Badge {...props} />;
        case "Input":
          return <Input {...props} />;
        case "Card":
          return (
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area.</p>
              </CardContent>
            </Card>
          );
        case "Alert":
          return (
            <Alert {...props}>
              <Info className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>
                This is an informational alert message.
              </AlertDescription>
            </Alert>
          );
        case "Progress":
          return <Progress {...props} />;
        case "Avatar":
          return (
            <Avatar {...props}>
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          );
        default:
          return (
            <div className="p-4 border border-gray-200 rounded bg-gray-50 text-gray-600">
              <p className="font-medium">Component Preview</p>
              <p className="text-sm">
                {example.name} - {example.componentType}
              </p>
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="p-4 border border-red-200 rounded bg-red-50 text-red-700">
          <p className="font-medium">Component Error</p>
          <p className="text-sm">{String(error)}</p>
        </div>
      );
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Catalog</h1>
        <p className="text-gray-600">
          Interactive documentation and examples for all UI components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Components</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-2 py-1 rounded text-sm capitalize ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category} (
                      {category === "all"
                        ? components.length
                        : components.filter((c) => c.category === category)
                            .length}
                      )
                    </button>
                  ))}
                </div>
              </div>

              {/* Component List */}
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredComponents.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedComponent(component)}
                      className={`w-full text-left p-3 rounded border ${
                        selectedComponent?.id === component.id
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-sm">
                        {component.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {component.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {component.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedComponent ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedComponent.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedComponent.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {selectedComponent.category}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedComponent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="usage"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Usage
                    </TabsTrigger>
                    <TabsTrigger
                      value="variants"
                      className="flex items-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Variants
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-6">
                    <div className="space-y-6">
                      <div className="p-6 border rounded-lg bg-white">
                        <h3 className="font-medium mb-4">Default Example</h3>
                        <div className="flex items-center justify-center min-h-32">
                          {renderComponent(selectedComponent)}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Component Code</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedComponent.code)
                          }
                        >
                          <Copy className="w-4 h-4 me-2" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{selectedComponent.code}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Usage Example</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(selectedComponent.usage)
                          }
                        >
                          <Copy className="w-4 h-4 me-2" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{selectedComponent.usage}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="variants" className="mt-6">
                    {selectedComponent.variants &&
                    selectedComponent.variants.length > 0 ? (
                      <div className="space-y-6">
                        {selectedComponent.variants.map((variant, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold">
                                  {variant.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {variant.description}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(variant.props, null, 2),
                                  )
                                }
                              >
                                <Copy className="w-4 h-4 me-2" />
                                Copy Props
                              </Button>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                              <div className="flex items-center justify-center min-h-24">
                                {renderComponent(selectedComponent, variant)}
                              </div>
                            </div>
                            <details className="mt-4">
                              <summary className="cursor-pointer font-medium text-sm">
                                View Props
                              </summary>
                              <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                                <code>
                                  {JSON.stringify(variant.props, null, 2)}
                                </code>
                              </pre>
                            </details>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No variants available for this component</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a Component
                  </h3>
                  <p>
                    Choose a component from the sidebar to view its
                    documentation
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
