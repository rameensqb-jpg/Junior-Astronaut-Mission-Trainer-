import { useEffect, useState } from "react";
import { store } from "./store";

export function useMissionArchive() {
  const [missions, setMissions] = useState([]);
  const [active, setActive] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMissions(store.getMissions());
    setActive(store.getActive());
    setReady(true);
  }, []);

  return { missions, active, latest: active || missions[0] || null, ready };
}
