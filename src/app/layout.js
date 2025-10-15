import "./globals.css";

export const metadata = {
  title: "ELS Philippines Inc.",
  description: "Start your laundry business like a veteran.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
           {children}
      </body>
    </html>
  )
}