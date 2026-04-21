import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { navigation } from "../constants/navigation";

export const usePageTitle = () => {
  const location = useLocation();

  return useMemo(() => {
    const foundItem = navigation
      .flatMap((section) => section.items)
      .find((item) => item.path === location.pathname);

    return foundItem?.label || "NovaLedger";
  }, [location.pathname]);
};

