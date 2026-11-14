import { useCallback, useEffect, useMemo, useState } from "react";
import { store } from "./store";
import { evaluateAchievements } from "@/lib/sim/achievements";
import {
  createCampaignMission,
  observeDay,
  assignCrew,
  choosePosture,
  runDayActivities,
  resolveDayEvent,
  closeDay,
  campaignProgress,
  respondToMessage,
  requestInfo,
  canCloseDay,
} from "@/lib/sim/campaignEngine";

export function useCampaign() {
  const [mission, setMission] = useState(null);
  const [archived, setArchived] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const active = store.getActive();
    if (active?.campaign) setMission(active);
    else if (active) store.clearActive();
    setArchived(store.getMissions());
    setReady(true);
  }, []);

  const commit = useCallback((next) => {
    if (!next) return null;
    setMission(next);
    if (next.phase === "active") {
      store.setActive(next);
    } else {
      store.clearActive();
      setArchived(store.addMission(next));
      store.unlock(evaluateAchievements(next));
    }
    return next;
  }, []);

  const start = useCallback((index, options = {}) => {
    const created = createCampaignMission(index, options);
    store.setActive(created);
    setMission(created);
    return created;
  }, []);

  const retry = useCallback(() => {
    if (!mission) return null;
    return start(mission.missionIndex, {
      seed: mission.seed,
      commander: mission.commander,
      emblem: mission.emblem,
      nasaEvent: mission.nasaEvent,
    });
  }, [mission, start]);

  const observe = () => mission && commit(observeDay(mission));
  const assign = (taskId, crewId) => mission && commit(assignCrew(mission, taskId, crewId));
  const posture = (id) => mission && commit(choosePosture(mission, id));
  const runActivities = () => mission && commit(runDayActivities(mission));
  const decide = (choiceId) => mission && commit(resolveDayEvent(mission, choiceId));
  const advance = () => mission && commit(closeDay(mission));
  const respond = (messageId, optionId) => mission && commit(respondToMessage(mission, messageId, optionId));
  const ask = (kind) => mission && commit(requestInfo(mission, kind));
  const abandon = () => {
    store.clearActive();
    setMission(null);
  };

  const progress = useMemo(() => campaignProgress(mission, archived), [mission, archived]);

  return {
    mission,
    archived,
    progress,
    ready,
    start,
    retry,
    observe,
    assign,
    posture,
    runActivities,
    decide,
    advance,
    respond,
    ask,
    abandon,
    canClose: mission ? canCloseDay(mission) : false,
  };
}
