import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 px-6 py-16">
      <h1 className="font-semibold text-xl tracking-tight">页面未找到</h1>
      <p className="text-muted-foreground text-sm">
        该地址不存在或已被移动。
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 max-w-fit items-center rounded-md px-4 text-sm font-medium"
      >
        返回首页
      </Link>
    </div>
  );
}
