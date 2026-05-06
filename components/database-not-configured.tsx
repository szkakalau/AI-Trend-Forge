function isLikelyCloudDeploy(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.RENDER ||
      process.env.RAILWAY_ENVIRONMENT_NAME,
  );
}

export function DatabaseNotConfigured() {
  const onCloud = isLikelyCloudDeploy();

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-border bg-card px-6 py-8 shadow-sm">
      <h1 className="font-semibold text-xl tracking-tight">需要先配置数据库</h1>
      {onCloud ? (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          当前运行环境<strong>没有</strong>读取到{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">DATABASE_URL</code>
          。项目里的 <code className="rounded bg-muted px-1 text-xs">.env</code>{" "}
          不会随 Git 上传，所以托管平台（Vercel / Render 等）必须单独在后台填写与本地相同的那条
          PostgreSQL 连接串，并重新部署一次。
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          当前 <code className="rounded bg-muted px-1 py-0.5 text-xs">DATABASE_URL</code>{" "}
          仍是示例占位符或未填写，登录后的页面都会访问 PostgreSQL，因此会出现 Internal Server
          Error。请换成真实连接串后再使用。
        </p>
      )}
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        {onCloud ? (
          <>
            <li>
              打开托管后台 → Environment（环境变量）→ 新增{" "}
              <code className="rounded bg-muted px-1 text-xs">DATABASE_URL</code>
              ，值为 Render Postgres 的 <strong>External Database URL</strong>（与本地
              <code className="rounded bg-muted px-1 text-xs"> .env </code>
              里相同的一条即可）。
            </li>
            <li>
              保存后执行一次 <strong>Redeploy / 重新部署</strong>，让新变量生效。
            </li>
          </>
        ) : (
          <>
            <li>
              在 Neon（或其它 Postgres）创建数据库，复制连接字符串（建议带{" "}
              <code className="rounded bg-muted px-1 text-xs">sslmode=require</code>）。
            </li>
            <li>
              编辑项目根目录 <code className="rounded bg-muted px-1 text-xs">.env</code>
              ，设置{" "}
              <code className="rounded bg-muted px-1 text-xs">DATABASE_URL=&quot;…&quot;</code>
              。
            </li>
            <li>
              在项目根执行{" "}
              <code className="rounded bg-muted px-1 text-xs">npm run db:push</code>
              ，然后重启 <code className="rounded bg-muted px-1 text-xs">npm run dev</code>
              。
            </li>
          </>
        )}
      </ol>
    </div>
  );
}
