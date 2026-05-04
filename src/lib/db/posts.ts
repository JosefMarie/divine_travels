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
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Post, PostInput } from '@/types';

const COLLECTION = 'posts';
const postsRef = collection(db, COLLECTION);

// Fetch all posts (one-time read)
export async function getPosts(status?: Post['status']): Promise<Post[]> {
  const q = status
    ? query(postsRef, where('status', '==', status), orderBy('createdAt', 'desc'))
    : query(postsRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
}

// Fetch a single post by ID
export async function getPost(id: string): Promise<Post | null> {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Post;
}

// Real-time listener — returns an unsubscribe function
export function subscribeToPosts(
  callback: (posts: Post[]) => void
): Unsubscribe {
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
    callback(posts);
  });
}

// Create a new post
export async function createPost(data: PostInput): Promise<string> {
  const ref = await addDoc(postsRef, {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

// Update an existing post
export async function updatePost(
  id: string,
  data: Partial<PostInput>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: Date.now() });
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
