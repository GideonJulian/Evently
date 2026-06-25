// src/hooks/useEvent.ts

import { useEffect, useState } from "react";
import { EventService } from "../services/event.service";

export function useEvent(id: string) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    try {
      const data = await EventService.getEvent(id);
      setEvent(data);
    } finally {
      setLoading(false);
    }
  }

  return {
    event,
    loading,
  };
}