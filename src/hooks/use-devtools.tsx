import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import type { Control, FieldValues } from "react-hook-form";

/**
 * React Hook Form DevToolsを動的にロードするカスタムフック
 *
 * 開発環境でのみ@hookform/devtoolsを動的にインポートし、
 * DevToolsコンポーネントを返します。
 *
 * @example
 * ```tsx
 * const { control } = useForm();
 * const DevTools = useDevTools(control);
 *
 * return (
 *   <>
 *     <MyForm control={control} />
 *     {DevTools}
 *   </>
 * );
 * ```
 *
 * @param control - React Hook Formのcontrolオブジェクト
 * @returns DevToolsコンポーネント（開発環境のみ）またはnull
 */
export const useDevTools = <T extends FieldValues>(
  control: Control<T>,
): ReactElement | null => {
  const [DevTool, setDevTool] = useState<any>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@hookform/devtools")
        .then((mod) => {
          setDevTool(() => mod.DevTool);
        })
        .catch(() => {
          // DevToolsが見つからない場合は無視
        });
    }
  }, []);

  if (process.env.NODE_ENV !== "development" || !DevTool) {
    return null;
  }

  return <DevTool control={control} />;
};
