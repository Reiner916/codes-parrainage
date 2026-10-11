import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Accueil",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Banque & Néobanque",
    path: "/banque",
    newTab: false,
  },
  {
    id: 3,
    title: "Crypto & Bourse",
    path: "/crypto",
    newTab: false,
  },
  {
    id: 4,
    title: "Comment ça marche",
    path: "/#comment-ca-marche",
    newTab: false,
  },
  {
    id: 5,
    title: "FAQ",
    path: "/#faq",
    newTab: false,
  },
];
export default menuData;
