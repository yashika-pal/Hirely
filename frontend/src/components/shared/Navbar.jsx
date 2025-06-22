import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const NavLinks = ({ user }) => (
  <>
    {user && user.role === "recruiter" ? (
      <>
        <Link
          to="/admin/companies"
          className="hover:text-[#6A38C2] transition-colors border-b-2 border-transparent hover:border-[#6A38C2]"
        >
          Companies
        </Link>
        <Link
          to="/admin/jobs"
          className="hover:text-[#6A38C2] transition-colors border-b-2 border-transparent hover:border-[#6A38C2]"
        >
          Jobs
        </Link>
        <Link
          to="/admin/messages"
          className="hover:text-[#6A38C2] transition-colors border-b-2 border-transparent hover:border-[#6A38C2]"
        >
          Messages
        </Link>
      </>
    ) : (
      <>
        <Link to="/" className="hover:text-[#6A38C2] transition-colors">
          Home
        </Link>
        <Link
          to="/jobs"
          className="no-underline hover:text-[#6A38C2] focus:text-[#6A38C2] active:text-[#6A38C2] transition-colors"
        >
          Jobs
        </Link>
        <Link to="/profile" className="hover:text-[#6A38C2] transition-colors">
          Profile
        </Link>
      </>
    )}
  </>
);

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  console.log("Navbar user:", user);
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <header className="bg-white shadow-md z-50 relative">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4">
        <Link to="/" className="text-4xl font-bold text-gray-800">
          Hirely
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-gray-800 text-lg font-semibold">
          <NavLinks user={user} />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullname}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {user?.fullname}
                      </h4>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div
                    onClick={logoutHandler}
                    className="flex items-center gap-2 text-red-600 mt-4 cursor-pointer hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-4 text-gray-800 font-semibold text-lg shadow-md">
          <div className="flex flex-col space-y-2">
            <NavLinks user={user} />
          </div>
          <div className="border-t pt-4 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={logoutHandler}
                variant="outline"
                className="text-red-600 hover:bg-red-100"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
