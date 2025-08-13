import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "./ui/Button";

const navLinks = [
    {
        label: "dashboard",
        href: "/",
    },
    {
        label: "reports",
        href: "#",
    },
    {
        label: "inventory",
        href: "#",
    },
    {
        label: "staff",
        href: "#",
    },
    {
        label: "waterSystems",
        href: "#",
    },
];

const Header = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <header>
            <nav className="border-border px-4 py-2.5 lg:px-6">
                <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
                    <a href="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            className="h-12"
                            alt="IETOS O&M Technologies logo"
                        />
                    </a>
                    <div className="flex items-center lg:order-2">
                        <Button
                            variant="outline"
                            className="border-slate-600"
                            asChild
                        >
                            <a href="#">{t("buttons.login")}</a>
                        </Button>
                        <Button
                            type="button"
                            className="bg-transparent text-slate-500 rounded-lg ms-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 lg:hidden"
                            size="icon"
                            onClick={() => setIsMenuOpen(open => !open)}
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">{t("buttons.openMenu")}</span>
                            {!isMenuOpen ? <MenuIcon className="size-6"/> : <XIcon className="size-6"/>}
                        </Button>
                    </div>
                    <ul className={`flex flex-col w-full font-medium ${isMenuOpen ? "mt-6 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-full"} lg:flex-row lg:w-auto lg:space-x-8 lg:mt-0 transition-all`}>
                        {navLinks.map((link, i) => (
                            <li key={`link-${i+1}`}>
                                <a
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`${isActive(link.href) ? "bg-primary-700 text-slate-100 lg:bg-transparent lg:text-primary-700" : "text-slate-700 lg:hover:text-primary-700"} border-b border-slate-100 block ps-3 pe-4 py-2 hover:bg-slate-50 lg:border-0 lg:p-0`}
                                >
                                    {t(`header.${link.label}`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;