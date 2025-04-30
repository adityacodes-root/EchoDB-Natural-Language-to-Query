import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";

/**
 * Metadata configuration for the application
 * Used for SEO and social media sharing
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://echodb-nlp-to-query.vercel.app"),
  title: "EchoDB - Natural Language to Query",
  description: "Transform natural language into SQL queries for PostgreSQL databases",
};

/**
 * Root layout component that wraps the entire application
 * Provides global styles, fonts, and theme configuration
 * @param children - The child components to render
 * @returns The root layout JSX
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistMono.className} ${GeistSans.className}`}>
        {/* Theme provider for dark/light mode support */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
