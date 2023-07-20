import { Metadata } from 'next'

import '../styles/globals.css'
 
export const metadata: Metadata = {
  title: 'Welcome to the Maggie.Zone',
  description: 'A website for my dog',
  themeColor: '#723d8f'
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }