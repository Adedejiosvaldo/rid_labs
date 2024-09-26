export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Rid Veterinary Clinic Management System",
  description: "Rid Vet Clinic Management System",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Doctors",
      href: "/doctors",
    },
    {
      label: "Pets",
      href: "/Pets",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
