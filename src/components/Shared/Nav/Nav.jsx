"use client";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "./Nav.css";
import Image from "next/image";
import LOGO from "../../../assets/images/logo02.png";
import Link from "next/link";
import UserInfoDialog from "@/components/CustomizeDiet/FormDialog/UserInfoDialog";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Array of pages and settings for navigation
const pages = [
  {
    nav: "Home",
    route: "/",
  },
  {
    nav: "Challenges",
    route: "/challenges",
  },

  {
    nav: "Pricing",
    route: "/pricing",
  },
  {
    nav: "Blog",
    route: "/blog",
  },
  {
    nav: "Trainers",
    route: "/trainers",
  },
  {
    nav: "Dashboard",
    route: "/dashboard",
  },
];

const Nav = () => {
  //loading state
  const [loader, setLoader] = useState(true);

  // State variables to manage menu anchor elements
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Event handlers for opening and closing navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // User session
  const { data: session } = useSession();

  // useEffect to update loader state when session is available
  useEffect(() => {
    if (session) {
      setLoader(false);
    }
  }, [session]);

  const handleLogout = () => {
    signOut();
  };

  return (
    // Top-level container for the navigation component
    <div className=" absolute w-[100%] z-50 top-0">
      <div className="bg-transparent hidden lg:flex justify-center items-center max-w-[1536px] mx-auto px-8">
        <Link href="/">
          <Image src={LOGO} width={120} sx={{ height: "auto" }} alt="Logo" />
        </Link>
        {/* Navigation links */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          {pages.slice(0, 5).map((page) => (
            <Link href={page?.route} key={page.route}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "#fff",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                {page.nav}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Join/Sign In/Help section */}
        <div className="flex gap-3 text-white font-bold items-center">
          {!session && <Link href="/api/auth/register">Join Us</Link>}

          <span>|</span>
          {session ? (
            <Button
              onClick={() => {
                signOut();
              }}
              sx={{ color: "#fff" }}
            >
              Log Out
            </Button>
          ) : (
            <Button
              onClick={() => {
                signIn();
              }}
              sx={{ color: "#fff" }}
            >
              Sign In
            </Button>
          )}

          <span>|</span>
          <Link href="#">Help </Link>

          {/* User Avatar or Sign In button */}
          {session && (
            <span className="hidden lg:block pl-2">
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User avatar" src={session.user.image} />
                </IconButton>
              </Tooltip>
            </span>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon className=" text-[#fff] " />
              </IconButton>

              {/* Mobile navigation menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                
                sx={{
                  display: { xs: "block", md: "none" }
                }}
              >
                {pages.map((page) => (
                  <Link  href={page.route} key={page.route}>
                    <MenuItem key={page.route} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.nav}</Typography>
                    </MenuItem>
                  </Link>
                ))}
                {session ? (
                  <button
                    onClick={handleLogout}
                    className="pl-2 pt-[6px] mx-[10px]"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="pl-2 pt-[6px] mx-[10px]"
                  >
                    Sign In
                  </button>
                )}

                <Box sx={{ flexGrow: 0, padding: "6px" }}>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      sx={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                    >
                      <Typography variant="p" sx={{ color: "#252525" }}>
                        {session?.user.email}
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      onClick={handleCloseUserMenu}
                      sx={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                    >
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      sx={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                    >
                      <Link href="/dashboard">
                        <Typography textAlign="center">Dashboard</Typography>
                      </Link>
                    </MenuItem>

                    {/* Conditionally rendering Logout/Sign In based on session */}
                    {session ? (
                      <MenuItem
                        onClick={handleLogout}
                        sx={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                      >
                        <Typography textAlign="center">Log Out</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => signIn()}
                        sx={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                      >
                        <Typography textAlign="center">Sign In</Typography>
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              </Menu>
            </Box>

            {/* Logo in mobile */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Image
                src={LOGO}
                width={100}
                sx={{ height: "auto" }}
                alt="Logo"
              />
            </Typography>

            {/* User menu in desktop */}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Nav;
