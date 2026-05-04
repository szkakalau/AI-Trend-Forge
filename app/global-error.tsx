"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hans">
      <body style={{ margin: 0, fontFamily: "system-ui,sans-serif", background: "#0a0a0a", color: "#fafafa", minHeight: "100vh" }}>
        <div style={{ padding: "2rem", maxWidth: "36rem", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>应用根组件出错</h1>
          <p style={{ opacity: 0.8, fontSize: "0.875rem", marginBottom: "1rem" }}>
            {error.message || "请查看控制台 (F12 → Console)，并确认已配置 Clerk 环境变量 (.env.local)。"}
          </p>
          <button
            type="button"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "#fafafa",
              color: "#0a0a0a",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            onClick={() => reset()}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
