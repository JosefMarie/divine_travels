import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: number;
}

export type MessageInput = Omit<Message, 'id' | 'createdAt' | 'status'>;

const COLLECTION = 'messages';
const msgRef = collection(db, COLLECTION);

// Real-time listener for admin
export function subscribeToMessages(
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(msgRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Message)
    );
    callback(messages);
  });
}

// Send a new message (public)
export async function sendMessage(
  data: MessageInput
): Promise<string> {
  const ref = await addDoc(msgRef, {
    ...data,
    status: 'unread',
    createdAt: Date.now(),
  });
  return ref.id;
}

// Update message status (admin)
export async function updateMessageStatus(
  id: string,
  status: Message['status']
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { status });
}

// Delete message (admin)
export async function deleteMessage(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
