import { Link } from "@tanstack/react-router";
import { HexButton } from "./ui/hex-button";
import { List, Search, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function Header() {
  return (
    <header className="p-4">
      <div className="flex items-center">
        <h1 className="ml-4 text-xl font-semibold text-foreground">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
        <nav className="text-foreground">
          <ul className="flex space-x-6 ml-10">
            <li>
              <Link to="/activity" className="hover:underline">
                Activities
              </Link>
            </li>
            <li>
              <Link to="/activity/create" className="hover:underline">
                Create
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Link
              </Link>
            </li>
          </ul>
        </nav>

        <div className="self-end ml-auto flex flex-row items-center gap-12 pr-6">
          <InputGroup className="max-w-3xs min-w-2xs">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon></InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <div className="flex gap-12 text-secondary">
            <Link to="/">
              <HexButton>
                <User />
              </HexButton>
            </Link>
            <Link to="/">
              <HexButton>
                <List />
              </HexButton>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-b border-border mt-4"></div>
    </header>
  );
}
