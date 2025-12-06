"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

// Wrapper simple para SessionProvider si no está en layout
// Pero para simplificar en cliente, asumiremos que SessionProvider envuelve la app o usamos props
// En NextAuth v5, se puede obtener session en server y pasarla, o usar SessionProvider.
// Vamos a crear un componente que maneje el login/logout actions.

export function UserMenu({ user }: { user?: any }) {
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => signIn()} 
        className="text-sm font-medium hover:text-indigo-600"
      >
        Iniciar Sesión
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200">
          <Image
            src={user.image || "https://placehold.co/100x100/png?text=U"}
            alt={user.name || "User"}
            fill
            className="object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
