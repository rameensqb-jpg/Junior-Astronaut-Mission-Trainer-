import { useCallback, useEffect, useState } from "react";
import { advanceDay, respondToMessage, requestInfo, resolveChoice } from "@/lib/sim/engine";
import { evaluateAchievements } from "@/lib/sim/achievements";
import { store } from "./store";

export function useMission() {
  const [mission, setMission] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMission(store.getActive());
    setReady(true);
  }, []);

  const commit = useCallback((next) => {
    setMission(next);
    if (next.phase === "active") {
      store.setActive(next);
    } else {
      store.clearActive();
      store.addMission(next);
      store.unlock(evaluateAchievements(next));
    }
    return next;
  }, []);

  const choose = (choiceId) => mission && commit(resolveChoice(mission, choiceId));
  const advance = () => mission && commit(advanceDay(mission));
  const respond = (messageId, optionId) => mission && commit(respondToMessage(mission, messageId, optionId));
  const ask = (kind) => mission && commit(requestInfo(mission, kind));
  const abandon = () => {
    store.clearActive();
    setMission(null);
  };

  return { mission, ready, choose, advance, respond, ask, abandon };
}
