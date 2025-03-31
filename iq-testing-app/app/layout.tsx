import "./globals.css";
import { ReactNode } from "react";
import NavBar from '@/components/NavBar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>IQ Testing Platform</title>
        <meta
          name="description"
          content="Test your IQ, EQ, and more, in a dark minimal UI."
        />
      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
