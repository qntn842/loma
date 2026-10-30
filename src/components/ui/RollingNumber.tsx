import { useEffect, useRef, useState } from "react";
import { TextProps } from "react-native";

import { Text, Tone, Weight } from "./Text";

type Props = TextProps & {
  value: number;
  format: (v: number) => string;
  weight?: Weight;
  tone?: Tone;
  className?: string;
  /** Durée de l'animation au premier affichage */
  duration?: number;
};

/** Nombre qui défile jusqu'à sa valeur, puis suit les mises à jour en douceur */
export function RollingNumber({ value, format, duration = 900, ...rest }: Props) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const start = from.current;
    const d = first.current ? duration : 400;
    first.current = false;
    const t0 = Date.now();
    let raf = 0;
    const tick = () => {
      const k = Math.min(1, (Date.now() - t0) / d);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = start + (value - start) * eased;
      setShown(v);
      from.current = v;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <Text {...rest}>{format(shown)}</Text>;
}
