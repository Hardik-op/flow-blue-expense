
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 container mx-auto max-w-6xl">
        {children}
      </main>
      <footer className="border-t py-4 px-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
