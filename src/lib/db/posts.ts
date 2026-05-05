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

// Increment recommendations count
export async function incrementRecommendations(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const current = snapshot.data().recommendations || 0;
    await updateDoc(ref, { recommendations: current + 1 });
  }
}

// Increment likes count
export async function incrementLikes(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const current = snapshot.data().likes || 0;
    await updateDoc(ref, { likes: current + 1 });
  }
}

// Comments sub-collection management
export async function addComment(postId: string, userName: string, content: string): Promise<void> {
  const commentsRef = collection(db, COLLECTION, postId, 'comments');
  await addDoc(commentsRef, {
    userName,
    content,
    createdAt: Date.now()
  });
}

export function subscribeToComments(postId: string, callback: (comments: any[]) => void): Unsubscribe {
  const commentsRef = collection(db, COLLECTION, postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(comments);
  });
}

// Comment likes management
export async function incrementCommentLikes(postId: string, commentId: string): Promise<void> {
  const ref = doc(db, COLLECTION, postId, 'comments', commentId);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const current = snapshot.data().likes || 0;
    await updateDoc(ref, { likes: current + 1 });
  }
}

// Replies sub-collection management
export async function addReply(postId: string, commentId: string, userName: string, content: string): Promise<void> {
  const repliesRef = collection(db, COLLECTION, postId, 'comments', commentId, 'replies');
  await addDoc(repliesRef, {
    userName,
    content,
    createdAt: Date.now()
  });
}

export function subscribeToReplies(postId: string, commentId: string, callback: (replies: any[]) => void): Unsubscribe {
  const repliesRef = collection(db, COLLECTION, postId, 'comments', commentId, 'replies');
  const q = query(repliesRef, orderBy('createdAt', 'asc')); // Oldest first for threads
  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(replies);
  });
}
