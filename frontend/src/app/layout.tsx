import "./globals.css";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = { title: "WORKFLEX Employees" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
