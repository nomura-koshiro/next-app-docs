import { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

export function PageLayout({ children, maxWidth = "6xl" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>{children}</div>
    </div>
  );
}
