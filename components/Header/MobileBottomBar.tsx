"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Plus, Bell, Star, User } from "lucide-react";
import { HeaderActions } from "@/components/Header/HeaderActions"; // Asegúrate de ajustar la ruta si es distinta

const MobileBottomBar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary shadow-md flex justify-around items-center py-3 px-4 mobile:flex hidden">
        {/* Home */}
        <button
          onClick={() => router.push("/inicio")}
          className="text-white flex flex-col items-center"
        >
          <Home className="w-6 h-6" />
        </button>

        {/* Crear */}
        <button
          onClick={() => console.log("Abrir drawer de creación")}
          className="text-white flex flex-col items-center"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Notificaciones */}
        <button
          onClick={() => console.log("Abrir notificaciones")}
          className="text-white flex flex-col items-center"
        >
          <Bell className="w-6 h-6" />
        </button>

        {/* Favoritos */}
        <button
          onClick={() => console.log("Abrir favoritos")}
          className="text-white flex flex-col items-center"
        >
          <Star className="w-6 h-6" />
        </button>

        {/* Usuario */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white flex flex-col items-center"
        >
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Menú de usuario móvil (reutiliza HeaderActions) */}
      <HeaderActions
        showNotificationButton={false}
        showAvatarButton={false}
        isOpenExternal={menuOpen}
        onOpenChange={setMenuOpen}
        anchorClassName="fixed bottom-16 right-4"
      />
    </>
  );
};

export default MobileBottomBar;
