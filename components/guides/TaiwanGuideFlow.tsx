"use client";

import { useEffect, useState } from "react";
import { TaiwanGateScreen } from "@/components/guides/TaiwanGateScreen";
import { TaiwanRouteCheck } from "@/components/guides/TaiwanRouteCheck";
import { EMPTY_PREP, type PrepAnswers } from "@/lib/guides/taiwan-route-check";
import {
  EMPTY_GATE,
  STORAGE_KEYS,
  getTaiwanCompetitions2026,
  type GateAnswers,
} from "@/lib/guides/taiwan-competitions-2026";

type Saved = { eventId: string; gate: GateAnswers; prep: PrepAnswers; createdOn: string };

function readSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.routeFlow);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Saved>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      eventId: typeof parsed.eventId === "string" ? parsed.eventId : "",
      gate: { ...EMPTY_GATE, ...(parsed.gate ?? {}) },
      prep: {
        program: parsed.prep?.program ?? "",
        music: parsed.prep?.music ?? "",
        partner: parsed.prep?.partner ?? "",
        test: parsed.prep?.test ?? "",
        coachHelp: Array.isArray(parsed.prep?.coachHelp) ? parsed.prep.coachHelp : [],
      },
      createdOn: typeof parsed.createdOn === "string" ? parsed.createdOn : "",
    };
  } catch {
    return null;
  }
}

export function TaiwanGuideFlow() {
  const competitions = getTaiwanCompetitions2026();
  const [now] = useState(() => new Date());
  const [eventId, setEventId] = useState(competitions[2]?.id ?? competitions[0]?.id ?? "");
  const [gate, setGate] = useState<GateAnswers>(EMPTY_GATE);
  const [prep, setPrep] = useState<PrepAnswers>(EMPTY_PREP);
  const [createdOn, setCreatedOn] = useState("");

  useEffect(() => {
    const saved = readSaved();
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
    if (saved) {
      if (saved.eventId) setEventId(saved.eventId);
      setGate(saved.gate);
      setPrep(saved.prep);
      setCreatedOn(saved.createdOn || today);
      return;
    }
    setCreatedOn(today);
  }, []);

  useEffect(() => {
    if (!createdOn) return;
    const payload: Saved = { eventId, gate, prep, createdOn };
    window.localStorage.setItem(STORAGE_KEYS.routeFlow, JSON.stringify(payload));
  }, [eventId, gate, prep, createdOn]);

  function clearAll() {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(new Date());
    setEventId(competitions[2]?.id ?? competitions[0]?.id ?? "");
    setGate(EMPTY_GATE);
    setPrep(EMPTY_PREP);
    setCreatedOn(today);
    window.localStorage.removeItem(STORAGE_KEYS.routeFlow);
  }

  return (
    <>
      <TaiwanGateScreen
        competitions={competitions}
        now={now}
        answers={gate}
        eventId={eventId}
        onAnswers={setGate}
        onEventId={setEventId}
        sectionId="prep-steps"
        flow
      />
      <TaiwanRouteCheck
        competitions={competitions}
        eventId={eventId}
        gate={gate}
        prep={prep}
        onPrep={setPrep}
        onClear={clearAll}
        createdOn={createdOn}
      />
    </>
  );
}
