import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
    {
    id: 6,
    title: "triage",
    path: "/triage",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 33,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "Support",
    path: "/contact",
    newTab: false,
  },
  {
    id: 5,
    title: "Téléconsultation",
    path: "/teleconsultation",
    newTab: false,
    submenu: [
      {
        id: 51,
        title: "Consultations",
        path: "/teleconsultation",
        newTab: false,
      },
      {
        id: 52,
        title: "Statistiques",
        path: "/teleconsultation/statistics",
        newTab: false,
      },
    ],
  },

  {
    id: 105,
    title: "First Aid",
    path: "/case",
    newTab: false,
  },
  {
    id: 106,
    title: "mortality rate",
    path: "/mortality",
    newTab: false,
  },
  {
    id: 6,
    title: "Rendez-vous",
    path: "/rendez-vous",
    newTab: false,
  },
  {
    id: 4,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "About Page",
        path: "/about",
        newTab: false,
      },
      {
        id: 42,
        title: "Contact Page",
        path: "/contact",
        newTab: false,
      },
      {
        id: 43,
        title: "Blog Grid Page",
        path: "/blog",
        newTab: false,
      },
      {
        id: 44,
        title: "Blog Sidebar Page",
        path: "/blog-sidebar",
        newTab: false,
      },
      {
        id: 45,
        title: "Blog Details Page",
        path: "/blog-details",
        newTab: false,
      },
      {
        id: 46,
        title: "Sign In Page",
        path: "/signin",
        newTab: false,
      },
      {
        id: 47,
        title: "Sign Up Page",
        path: "/signup",
        newTab: false,
      },
      {
        id: 48,
        title: "Error Page",
        path: "/error",
        newTab: false,
      },
    ],
  },
];
export default menuData;
