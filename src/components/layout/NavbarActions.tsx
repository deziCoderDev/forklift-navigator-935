import React from "react";
import { Search, User, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

const NavbarActions: React.FC<Props> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent transition-colors"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent transition-colors"
        onClick={() => navigate('/configuracao')}
        aria-label="Configurações"
      >
        <Settings className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" className="hover:bg-accent transition-colors">
        <User className="w-5 h-5" />
      </Button>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

export default NavbarActions;
