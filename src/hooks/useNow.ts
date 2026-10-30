import { useEffect, useState } from "react";

/** L'heure actuelle, rafraîchie toutes les `intervalMs` (comme un setInterval dans un useEffect sur le web) */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
