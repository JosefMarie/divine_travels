"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Activity, Shield, Users, MessageSquare } from "lucide-react";

interface TickerEvent {
  id: string;
  type: 'access' | 'presence' | 'message' | 'content';
  label: string;
  time: string;
}

export const AdminTicker = () => {
  const [events, setEvents] = useState<TickerEvent[]>([]);

  const addEvent = (event: TickerEvent) => {
    setEvents(prev => {
      // Prevent exact duplicate IDs
      if (prev.some(e => e.id === event.id)) return prev;
      
      // Prevent consecutive identical labels (e.g., multiple pings for the same sector)
      if (prev.length > 0 && prev[0].label === event.label) return prev;
      
      return [event, ...prev].slice(0, 5);
    });
  };

  useEffect(() => {
    // 1. Listen for new messages
    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(1)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            addEvent({
              id: `msg-${change.doc.id}`,
              type: 'message',
              label: `COMM_INBOUND: ${data.name || 'Anonymous'}`,
              time: new Date().toLocaleTimeString()
            });
          }
        });
      }
    );

    // 2. Listen for security logs
    const unsubSecurity = onSnapshot(
      query(collection(db, "security_logs"), orderBy("timestamp", "desc"), limit(1)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            addEvent({
              id: `sec-${change.doc.id}`,
              type: 'access',
              label: `SECURITY_BREACH_DETECTED: ${data.action}`,
              time: new Date().toLocaleTimeString()
            });
          }
        });
      }
    );

    // 3. Listen for presence heartbeats
    const unsubPresence = onSnapshot(
      query(collection(db, "presence"), limit(5)),
      (snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "modified" || change.type === "added") {
            addEvent({
              id: `pres-${change.doc.id}`,
              type: 'presence',
              label: `OPERATOR_PING: Sector_${change.doc.id.substring(0, 4)}`,
              time: new Date().toLocaleTimeString()
            });
          }
        });
      }
    );

    return () => {
      unsubMessages();
      unsubSecurity();
      unsubPresence();
    };
  }, []);

  const getIcon = (type: TickerEvent['type']) => {
    switch (type) {
      case 'access': return <Shield size={10} className="text-tertiary" />;
      case 'presence': return <Users size={10} className="text-primary" />;
      case 'message': return <MessageSquare size={10} className="text-primary" />;
      default: return <Activity size={10} className="text-primary" />;
    }
  };

  return (
    <div className="w-full bg-neutral border-y border-primary/5 py-3 px-8 overflow-hidden">
      <div className="flex items-center gap-12 whitespace-nowrap">
        <div className="flex items-center gap-2 border-r border-primary/10 pr-12">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="font-technical text-[9px] uppercase tracking-[0.2em] font-bold text-primary/40">Realtime_Ops_Center</span>
        </div>

        <div className="flex gap-16 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                {getIcon(event.type)}
                <span className="font-technical text-[9px] font-bold text-primary tracking-widest uppercase">
                  {event.label}
                </span>
                <span className="font-technical text-[7px] text-primary/20 font-bold">
                  [{event.time}]
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {events.length === 0 && (
          <div className="flex items-center gap-3 opacity-20">
            <span className="font-technical text-[9px] font-bold uppercase tracking-widest">Awaiting Command Stream...</span>
          </div>
        )}
      </div>
    </div>
  );
};
