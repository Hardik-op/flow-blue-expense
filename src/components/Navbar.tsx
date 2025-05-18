
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Expenses", path: "/expenses" },
    { label: "Reports", path: "/reports" },
    { label: "Budget", path: "/budget" }
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 font-medium rounded-md transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:bg-secondary text-foreground"
    }`;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">ExpenseFlow</h1>
          </div>

          {isMobile ? (
            <div className="flex items-center">
              <Button variant="ghost" onClick={toggleMenu} size="icon">
                <Menu />
              </Button>
            </div>
          ) : (
            <nav className="flex items-center space-x-1">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClasses}
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isOpen && (
          <div className="py-3 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClasses}
                  onClick={() => setIsOpen(false)}
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
