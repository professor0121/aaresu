import React, { useState } from "react";
import {
    CheckCircle,
    HelpCircle,
    Circle,
    Menu,
    X,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import { useAuthContent } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

const components = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description: "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description: "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

function MobileMenuItem({ title, children, hasSubmenu = false }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!hasSubmenu) {
        return (
            <li className="border-b border-gray-200 last:border-b-0">
                <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-gray-50">
                    {title}
                </a>
            </li>
        );
    }

    return (
        <li className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-3 px-4 text-left text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="bg-gray-50 border-t border-gray-200">
                    {children}
                </div>
            )}
        </li>
    );
}

function DesktopMenuItem({ title, children, hasSubmenu = false, href = "#" }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!hasSubmenu) {
        return (
            <li className="relative">
                <a
                    href={href}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                    {title}
                </a>
            </li>
        );
    }

    return (
        <li 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                {title}
                <ChevronDown size={16} className="ml-1" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-max">
                    {children}
                </div>
            )}
        </li>
    );
}

function ListItem({ title, children, to = "#", ...props }) {
    return (
        <li {...props}>
            <a
                href={to}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
                <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
                <p className="text-gray-600 text-sm leading-snug mt-1">
                    {children}
                </p>
            </a>
        </li>
    );
}

// Authentication section component
function AuthSection({ isMobile = false }) {
    const { user, ifAuthenticated, ifNotAuthenticated } = useAuthContent();

    return (
        <div className={isMobile ? "space-y-2" : "flex items-center space-x-4"}>
            {ifAuthenticated(
                <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-3'}`}>
                    <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-2'}`}>
                        <User size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {user?.username || user?.email}
                        </span>
                        {user?.verified && (
                            <CheckCircle size={14} className="text-green-500" title="Verified" />
                        )}
                    </div>
                    <LogoutButton
                        className={`${isMobile ? 'w-full' : ''} px-3 py-1 text-xs`}
                    >
                        <LogOut size={14} className="mr-1" />
                        Logout
                    </LogoutButton>
                </div>
            )}

            {ifNotAuthenticated(
                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
                    <a
                        href="/login"
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                    >
                        Register
                    </a>
                </div>
            )}
        </div>
    );
}

export default function ResponsiveNavigationMenu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="text-xl font-bold text-gray-900">Logo</div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <ul className="flex space-x-2">
                            {/* Home */}
                            <DesktopMenuItem title="Home" hasSubmenu={true}>
                                <div className="w-96 p-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                            <div className="text-lg font-medium text-gray-900 mb-2">shadcn/ui</div>
                                            <p className="text-gray-600 text-sm">
                                                Beautifully designed components built with Tailwind CSS.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <a href="/docs" className="block p-2 rounded hover:bg-gray-50">
                                                <div className="font-medium text-gray-900">Introduction</div>
                                                <div className="text-sm text-gray-600">Re-usable components built using Radix UI and Tailwind CSS.</div>
                                            </a>
                                            <a href="/docs/installation" className="block p-2 rounded hover:bg-gray-50">
                                                <div className="font-medium text-gray-900">Installation</div>
                                                <div className="text-sm text-gray-600">How to install dependencies and structure your app.</div>
                                            </a>
                                            <a href="/docs/primitives/typography" className="block p-2 rounded hover:bg-gray-50">
                                                <div className="font-medium text-gray-900">Typography</div>
                                                <div className="text-sm text-gray-600">Styles for headings, paragraphs, lists...etc</div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </DesktopMenuItem>

                            {/* Components */}
                            <DesktopMenuItem title="Components" hasSubmenu={true}>
                                <div className="w-96 max-h-96 overflow-y-auto">
                                    <ul className="grid grid-cols-1 gap-1 p-2">
                                        {components.map((component) => (
                                            <ListItem key={component.title} title={component.title} to={component.href}>
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </div>
                            </DesktopMenuItem>

                            {/* Docs */}
                            <DesktopMenuItem title="Docs" href="/docs" />

                            {/* List */}
                            <DesktopMenuItem title="List" hasSubmenu={true}>
                                <div className="w-72 p-2">
                                    <ul>
                                        <li>
                                            <a href="#" className="block p-3 hover:bg-gray-50 rounded">
                                                <div className="font-medium text-gray-900">Components</div>
                                                <div className="text-sm text-gray-600">Browse all components in the library.</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block p-3 hover:bg-gray-50 rounded">
                                                <div className="font-medium text-gray-900">Documentation</div>
                                                <div className="text-sm text-gray-600">Learn how to use the library.</div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block p-3 hover:bg-gray-50 rounded">
                                                <div className="font-medium text-gray-900">Blog</div>
                                                <div className="text-sm text-gray-600">Read our latest blog posts.</div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </DesktopMenuItem>

                            {/* Simple */}
                            <DesktopMenuItem title="Simple" hasSubmenu={true}>
                                <div className="w-48 p-2">
                                    <ul>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-50 rounded">Components</a></li>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-50 rounded">Documentation</a></li>
                                        <li><a href="#" className="block px-4 py-2 hover:bg-gray-50 rounded">Blocks</a></li>
                                    </ul>
                                </div>
                            </DesktopMenuItem>

                            {/* With Icon */}
                            <DesktopMenuItem title="With Icon" hasSubmenu={true}>
                                <div className="w-48 p-2">
                                    <ul>
                                        <li>
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded">
                                                <HelpCircle size={16} />
                                                Backlog
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded">
                                                <Circle size={16} />
                                                To Do
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded">
                                                <CheckCircle size={16} />
                                                Done
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </DesktopMenuItem>
                        </ul>
                    </div>

                    {/* Profile (Desktop) */}
                    <div className="hidden md:block">
                        <AuthSection />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isMobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="max-h-96 overflow-y-auto">
                        <ul className="py-2">
                            {/* Home */}
                            <MobileMenuItem title="Home" hasSubmenu={true}>
                                <div className="px-4 py-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg mb-3">
                                        <div className="font-medium text-gray-900 mb-1">shadcn/ui</div>
                                        <p className="text-gray-600 text-sm">
                                            Beautifully designed components built with Tailwind CSS.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <a href="/docs" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Introduction</div>
                                            <div className="text-sm text-gray-600">Re-usable components built using Radix UI and Tailwind CSS.</div>
                                        </a>
                                        <a href="/docs/installation" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Installation</div>
                                            <div className="text-sm text-gray-600">How to install dependencies and structure your app.</div>
                                        </a>
                                        <a href="/docs/primitives/typography" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Typography</div>
                                            <div className="text-sm text-gray-600">Styles for headings, paragraphs, lists...etc</div>
                                        </a>
                                    </div>
                                </div>
                            </MobileMenuItem>

                            {/* Components */}
                            <MobileMenuItem title="Components" hasSubmenu={true}>
                                <div className="px-4 py-2 max-h-64 overflow-y-auto">
                                    <div className="space-y-2">
                                        {components.map((component) => (
                                            <a key={component.title} href={component.href} className="block p-2 rounded hover:bg-gray-100">
                                                <div className="font-medium text-gray-900">{component.title}</div>
                                                <div className="text-sm text-gray-600">{component.description}</div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </MobileMenuItem>

                            {/* Docs */}
                            <MobileMenuItem title="Docs" />

                            {/* List */}
                            <MobileMenuItem title="List" hasSubmenu={true}>
                                <div className="px-4 py-2">
                                    <div className="space-y-2">
                                        <a href="#" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Components</div>
                                            <div className="text-sm text-gray-600">Browse all components in the library.</div>
                                        </a>
                                        <a href="#" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Documentation</div>
                                            <div className="text-sm text-gray-600">Learn how to use the library.</div>
                                        </a>
                                        <a href="#" className="block p-2 rounded hover:bg-gray-100">
                                            <div className="font-medium text-gray-900">Blog</div>
                                            <div className="text-sm text-gray-600">Read our latest blog posts.</div>
                                        </a>
                                    </div>
                                </div>
                            </MobileMenuItem>

                            {/* Simple */}
                            <MobileMenuItem title="Simple" hasSubmenu={true}>
                                <div className="px-4 py-2">
                                    <div className="space-y-1">
                                        <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100 text-gray-700">Components</a>
                                        <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100 text-gray-700">Documentation</a>
                                        <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100 text-gray-700">Blocks</a>
                                    </div>
                                </div>
                            </MobileMenuItem>

                            {/* With Icon */}
                            <MobileMenuItem title="With Icon" hasSubmenu={true}>
                                <div className="px-4 py-2">
                                    <div className="space-y-1">
                                        <a href="#" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 text-gray-700">
                                            <HelpCircle size={16} />
                                            Backlog
                                        </a>
                                        <a href="#" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 text-gray-700">
                                            <Circle size={16} />
                                            To Do
                                        </a>
                                        <a href="#" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 text-gray-700">
                                            <CheckCircle size={16} />
                                            Done
                                        </a>
                                    </div>
                                </div>
                            </MobileMenuItem>
                        </ul>
                    </div>
                    
                    {/* Mobile Profile */}
                    <div className="px-4 py-3 border-t border-gray-200">
                        <AuthSection isMobile={true} />
                    </div>
                </div>
            )}
        </nav>
    );
}