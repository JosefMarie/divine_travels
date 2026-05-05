"use client";

import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users } from "lucide-react";

interface PresenceManagerProps {
  postId: string;
}

export const PresenceManager = ({ postId }: PresenceManagerProps) => {
  const [activeCount, setActiveCount] = useState(1);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    if (!postId) return;

    const presenceRef = doc(db, "presence", `${postId}_${sessionId}`);
    
    // 1. Enter the sector (Add presence)
    const enterSector = async () => {
      try {
        await setDoc(presenceRef, {
          postId,
          updatedAt: Date.now(),
        });
      } catch (e) {
        console.error("Presence Error:", e);
      }
    };

    enterSector();

    // 2. Heartbeat every 45 seconds
    const interval = setInterval(async () => {
      await setDoc(presenceRef, {
        postId,
        updatedAt: Date.now(),
      }, { merge: true });
    }, 45000);

    // 3. Listen for other operators
    const q = query(
      collection(db, "presence"), 
      where("postId", "==", postId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const active = snapshot.docs.filter(d => {
        const data = d.data();
        // Count as active if updated in the last 2 minutes
        return data.updatedAt && (now - data.updatedAt < 120000);
      });
      setActiveCount(Math.max(1, active.length));
    });

    // 4. Leave the sector (Cleanup)
    return () => {
      clearInterval(interval);
      unsub();
      deleteDoc(presenceRef).catch(() => {});
    };
  }, [postId, sessionId]);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/5 border border-tertiary/20 rounded-full">
      <Users size={10} className="text-tertiary animate-pulse" />
      <span className="font-technical text-[8px] text-tertiary font-bold uppercase tracking-widest">
        {activeCount} {activeCount === 1 ? "Operator" : "Operators"} in Sector
      </span>
    </div>
  );
};
