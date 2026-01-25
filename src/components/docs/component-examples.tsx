import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  componentType: string;
  props?: Record<string, any>;
  code: string;
  usage: string;
  variants?: Array<{
    name: string;
    props: Record<string, any>;
    description: string;
  }>;
}

export const componentExamples: ComponentExample[] = [
  {
    id: "button",
    name: "Button",
    description: "Clickable button component with multiple variants and sizes",
    category: "form",
    tags: ["interactive", "form", "action"],
    componentType: "Button",
    props: { children: "Click me" },
    code: `import { Button } from '@/components/ui/button';

export function ButtonExample() {
  return <Button>Click me</Button>;
}`,
    usage: `<Button variant="default" size="md">
  Click me
</Button>`,
    variants: [
      {
        name: "Primary",
        props: { children: "Primary", variant: "default" },
        description: "Default primary button style",
      },
      {
        name: "Secondary",
        props: { children: "Secondary", variant: "secondary" },
        description: "Secondary button style",
      },
      {
        name: "Destructive",
        props: { children: "Delete", variant: "destructive" },
        description: "Destructive action button",
      },
      {
        name: "Outline",
        props: { children: "Outline", variant: "outline" },
        description: "Outlined button style",
      },
      {
        name: "Ghost",
        props: { children: "Ghost", variant: "ghost" },
        description: "Minimal ghost button",
      },
      {
        name: "Small",
        props: { children: "Small", size: "sm" },
        description: "Small size button",
      },
      {
        name: "Large",
        props: { children: "Large", size: "lg" },
        description: "Large size button",
      },
      {
        name: "Disabled",
        props: { children: "Disabled", disabled: true },
        description: "Disabled button state",
      },
    ],
  },
  {
    id: "card",
    name: "Card",
    description: "Flexible container component for grouping related content",
    category: "layout",
    tags: ["container", "layout", "content"],
    componentType: "Card",
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  );
}`,
    usage: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>`,
  },
  {
    id: "badge",
    name: "Badge",
    description: "Small status indicator or label component",
    category: "display",
    tags: ["status", "label", "indicator"],
    componentType: "Badge",
    props: { children: "Badge" },
    code: `import { Badge } from '@/components/ui/badge';

export function BadgeExample() {
  return <Badge>Badge</Badge>;
}`,
    usage: `<Badge variant="default">Default</Badge>`,
    variants: [
      {
        name: "Default",
        props: { children: "Default" },
        description: "Default badge style",
      },
      {
        name: "Secondary",
        props: { children: "Secondary", variant: "secondary" },
        description: "Secondary badge style",
      },
      {
        name: "Destructive",
        props: { children: "Error", variant: "destructive" },
        description: "Error or destructive badge",
      },
      {
        name: "Outline",
        props: { children: "Outline", variant: "outline" },
        description: "Outlined badge style",
      },
    ],
  },
  {
    id: "input",
    name: "Input",
    description: "Text input field for user data entry",
    category: "form",
    tags: ["form", "input", "text"],
    componentType: "Input",
    props: { placeholder: "Enter text..." },
    code: `import { Input } from '@/components/ui/input';

export function InputExample() {
  return <Input placeholder="Enter text..." />;
}`,
    usage: `<Input 
  type="text" 
  placeholder="Enter text..."
  value={value}
  onChange={handleChange}
/>`,
    variants: [
      {
        name: "Default",
        props: { placeholder: "Default input" },
        description: "Standard text input",
      },
      {
        name: "Password",
        props: { type: "password", placeholder: "Password" },
        description: "Password input field",
      },
      {
        name: "Email",
        props: { type: "email", placeholder: "email@example.com" },
        description: "Email input field",
      },
      {
        name: "Disabled",
        props: { placeholder: "Disabled", disabled: true },
        description: "Disabled input state",
      },
    ],
  },
  {
    id: "alert",
    name: "Alert",
    description: "Important message or notification component",
    category: "feedback",
    tags: ["notification", "message", "feedback"],
    componentType: "Alert",
    code: `import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export function AlertExample() {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>
        This is an informational alert message.
      </AlertDescription>
    </Alert>
  );
}`,
    usage: `<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert description</AlertDescription>
</Alert>`,
    variants: [
      {
        name: "Info",
        props: {},
        description: "Informational alert",
      },
      {
        name: "Success",
        props: { className: "border-green-200 bg-green-50" },
        description: "Success alert variant",
      },
      {
        name: "Warning",
        props: { className: "border-yellow-200 bg-yellow-50" },
        description: "Warning alert variant",
      },
      {
        name: "Error",
        props: { className: "border-red-200 bg-red-50" },
        description: "Error alert variant",
      },
    ],
  },
  {
    id: "progress",
    name: "Progress",
    description: "Visual progress indicator component",
    category: "feedback",
    tags: ["progress", "loading", "indicator"],
    componentType: "Progress",
    props: { value: 60, className: "w-60" },
    code: `import { Progress } from '@/components/ui/progress';

export function ProgressExample() {
  return <Progress value={60} className="w-60" />;
}`,
    usage: `<Progress value={progress} max={100} />`,
    variants: [
      {
        name: "25%",
        props: { value: 25, className: "w-60" },
        description: "25% progress",
      },
      {
        name: "50%",
        props: { value: 50, className: "w-60" },
        description: "50% progress",
      },
      {
        name: "75%",
        props: { value: 75, className: "w-60" },
        description: "75% progress",
      },
      {
        name: "100%",
        props: { value: 100, className: "w-60" },
        description: "Complete progress",
      },
    ],
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "User profile picture or initials display",
    category: "display",
    tags: ["user", "profile", "image"],
    componentType: "Avatar",
    code: `import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AvatarExample() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`,
    usage: `<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`,
    variants: [
      {
        name: "With Image",
        props: {},
        description: "Avatar with profile image",
      },
      {
        name: "Fallback Only",
        props: { src: undefined },
        description: "Avatar showing initials fallback",
      },
      {
        name: "Large",
        props: { className: "h-16 w-16" },
        description: "Large size avatar",
      },
      {
        name: "Small",
        props: { className: "h-8 w-8" },
        description: "Small size avatar",
      },
    ],
  },
];
