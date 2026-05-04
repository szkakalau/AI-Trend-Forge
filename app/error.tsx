"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 px-6 py-16">
      <h1 className="font-semibold text-xl tracking-tight">页面加载出错</h1>
      <p className="text-muted-foreground text-sm">
        {error.message || "发生未知错误。请打开浏览器开发者工具 (F12) → Console 查看详情。"}
      </p>
      <button
        type="button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 max-w-fit items-center rounded-md px-4 text-sm font-medium"
        onClick={() => reset()}
      >
        重试
      </button>
    </div>
  );
}
