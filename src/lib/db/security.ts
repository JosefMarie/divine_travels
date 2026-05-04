import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  limit,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";

export interface SecurityLog {
  id: string;
  timestamp: Timestamp;
  nodePath: string;
  location: string;
  status: 'AUTHORIZED' | 'DENIED' | 'LOCKED';
  alert?: boolean;
}

export const subscribeToSecurityLogs = (callback: (logs: SecurityLog[]) => void) => {
  if (!auth.currentUser) return () => {};

  const q = query(
    collection(db, "security_logs"), 
    orderBy("timestamp", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SecurityLog[];
    callback(logs);
  }, (error) => {
    console.error("Security Registry Subscription Error:", error);
  });
};

export const logAccessAttempt = async (
  nodePath: string, 
  location: string, 
  status: 'AUTHORIZED' | 'DENIED' | 'LOCKED',
  alert: boolean = false
) => {
  if (!auth.currentUser && status !== 'DENIED') {
    console.warn("Security log suppressed: No active operator signature.");
    return;
  }

  try {
    await addDoc(collection(db, "security_logs"), {
      nodePath,
      location,
      status,
      alert,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
};
