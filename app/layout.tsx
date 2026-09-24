import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  title: "JL 摄影｜人物写真与汉服摄影",
  description: "JL 摄影作品集。专注人物写真、汉服摄影与有情绪的自然肖像。",
  icons: { icon: "./favicon.svg" },
  openGraph: {
    title: "JL 摄影｜让光，留住时间",
    description: "人物写真 · 汉服摄影 · 情绪肖像",
    type: "website",
    url: "https://jz7930565-design.github.io/zhongjialun-photography/",
    images: ["https://jz7930565-design.github.io/zhongjialun-photography/og-jl.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JL 摄影｜让光，留住时间",
    description: "人物写真 · 汉服摄影 · 情绪肖像",
    images: ["https://jz7930565-design.github.io/zhongjialun-photography/og-jl.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
