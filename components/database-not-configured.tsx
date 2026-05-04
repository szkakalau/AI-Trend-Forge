export function DatabaseNotConfigured() {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-border bg-card px-6 py-8 shadow-sm">
      <h1 className="font-semibold text-xl tracking-tight">需要先配置数据库</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        当前 <code className="rounded bg-muted px-1 py-0.5 text-xs">DATABASE_URL</code>{" "}
        仍是示例占位符或未填写，登录后的页面都会访问 PostgreSQL，因此会出现 Internal Server
        Error。请换成真实连接串后再使用。
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          在 Neon（或其它 Postgres）创建数据库，复制连接字符串（建议带{" "}
          <code className="rounded bg-muted px-1 text-xs">sslmode=require</code>）。
        </li>
        <li>
          编辑项目根目录 <code className="rounded bg-muted px-1 text-xs">.env</code>，设置{" "}
          <code className="rounded bg-muted px-1 text-xs">DATABASE_URL=&quot;…&quot;</code>
          。
        </li>
        <li>
          在项目根执行{" "}
          <code className="rounded bg-muted px-1 text-xs">npm run db:push</code>
          ，然后重启 <code className="rounded bg-muted px-1 text-xs">npm run dev</code>
          。
        </li>
      </ol>
    </div>
  );
}
