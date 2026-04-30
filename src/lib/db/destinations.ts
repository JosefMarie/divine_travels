import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Destination, DestinationInput } from '@/types';

const COLLECTION = 'destinations';
const destRef = collection(db, COLLECTION);

// Fetch all destinations (one-time)
export async function getDestinations(): Promise<Destination[]> {
  const q = query(destRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Destination));
}

// Fetch a single destination by ID
export async function getDestination(id: string): Promise<Destination | null> {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Destination;
}

// Real-time listener
export function subscribeToDestinations(
  callback: (destinations: Destination[]) => void
): Unsubscribe {
  const q = query(destRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const destinations = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Destination)
    );
    callback(destinations);
  });
}

// Create a new destination
export async function createDestination(
  data: DestinationInput
): Promise<string> {
  const ref = await addDoc(destRef, {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

// Update a destination
export async function updateDestination(
  id: string,
  data: Partial<DestinationInput>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: Date.now() });
}

// Delete a destination
export async function deleteDestination(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
