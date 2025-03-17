import { Inter } from 'next/font/google';
import LayoutContent from './LayoutContent';
// import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'] });

// ✅ Metadata for Next.js
export const metadata = {
  title: "CarBuyDirect",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-white ${inter.className}`}>
        {/* <Providers> */}
          <LayoutContent>{children}</LayoutContent>
        {/* </Providers> */}
      </body>
    </html>
  );
}
