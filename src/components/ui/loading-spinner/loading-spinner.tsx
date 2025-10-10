type LoadingSpinnerProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

export function LoadingSpinner({
  text = "読み込み中...",
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 h-12 w-12" />
      <div className={sizeClasses[size]}>{text}</div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
