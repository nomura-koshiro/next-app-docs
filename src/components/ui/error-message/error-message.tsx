import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  title?: string;
  message: string;
  fullScreen?: boolean;
};

export function ErrorMessage({
  title = "エラー",
  message,
  fullScreen = false,
}: ErrorMessageProps) {
  const alertContent = (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">{alertContent}</div>
      </div>
    );
  }

  return alertContent;
}
