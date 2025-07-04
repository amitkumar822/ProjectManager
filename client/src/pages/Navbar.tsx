// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/app/reduxHook";
import { logout } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          Task<span className="text-emerald-200">Manager</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex gap-1 items-center"
            >
              <LogOut size={16} />
              Logout
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/login")}
              className="flex gap-1 items-center"
            >
              <LogIn size={16} />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent className="bg-white text-black p-6">
            <nav className="flex flex-col gap-4 mt-4">
              <Link to="/" onClick={() => setOpen(false)} className="font-medium">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="font-medium">
                  Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="mt-4"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="mt-4"
                >
                  Login
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
