import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { GlobalProvider } from "@/constants/global-context";



export const metadata: Metadata = {
  title: "Namma Restaurant",
  description: "Experience the rich culinary heritage of South India, crafted with love and served fresh for your takeaway delight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <GlobalProvider>
        <Header/>
        {children}
        <Footer/>
      </GlobalProvider>
      </body>
    </html>
  );
}
