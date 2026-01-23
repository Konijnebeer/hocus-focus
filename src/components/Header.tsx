import { Link, useNavigate } from "@tanstack/react-router";
import { HexButton } from "./ui/hex-button";
import { User } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./ui/combobox";
import { getAllUsers } from "@/database/userDb";
import type { User as UserType } from "@/database/userDb";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Load all users on mount
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  const handleProfileClick = () => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
      navigate({ to: `/user/$id`, params: { id: loggedInUserId } });
    } else {
      navigate({ to: "/login" });
    }
  };

  const handleUserSelect = (user: UserType | null) => {
    if (user) {
      navigate({ to: `/user/$id`, params: { id: user.id } });
      // Reset selection after navigation
      setTimeout(() => setSelectedUser(null), 100);
    }
  };

  return (
    <header className="p-4">
      <div className="flex items-center">
        <h1 className="ml-6 text-xl font-semibold text-foreground">
          <Link to="/">
            <img src="/Logo.png" alt="Logo" className="h-16" />
          </Link>
        </h1>
        <h2 className="ml-10 text-[32px] text-foreground">Connectar</h2>
        <nav className="text-foreground">
          <ul className="flex space-x-6 ml-12">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
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
          </ul>
        </nav>

        <div className="self-end ml-auto flex flex-row items-center gap-12 pr-6">
          <Combobox
            items={users}
            itemToStringValue={(user) =>
              `${user.name} ${user.surname} ${user.email}`
            }
            value={selectedUser}
            onValueChange={handleUserSelect}
          >
            <ComboboxInput
              placeholder="Search users..."
              showTrigger={false}
              className="max-w-3xs min-w-2xs"
            />
            <ComboboxContent>
              <ComboboxEmpty>No users found</ComboboxEmpty>
              <ComboboxList>
                {(user) => (
                  <ComboboxItem key={user.id} value={user}>
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.name} {user.surname}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <div className="flex gap-12 text-secondary">
            <button onClick={handleProfileClick}>
              <HexButton>
                <User />
              </HexButton>
            </button>
            {/*<Link to="/">
              <HexButton>
                <List />
              </HexButton>
            </Link>*/}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-b border-border mt-4"></div>
    </header>
  );
}
