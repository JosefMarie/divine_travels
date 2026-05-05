import { 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc,
  onSnapshot,
  collection
} from 'firebase/firestore';
import { db } from '../firebase';
import { SectorId, SiteSectorDoc } from '@/types';

const CONTENT_COLLECTION = 'site_content';

/**
 * Fetches the current live (published) content for a specific sector.
 */
export async function getSectorContent<T>(sectorId: SectorId, forceServer = false): Promise<T | null> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, sectorId);
    const docSnap = forceServer ? await getDocFromServer(docRef) : await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().published as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching published content for ${sectorId}:`, error);
    return null;
  }
}

/**
 * Fetches the draft content for administrative editing.
 */
export async function getSectorDraft<T>(sectorId: SectorId, forceServer = false): Promise<T | null> {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, sectorId);
    const docSnap = forceServer ? await getDocFromServer(docRef) : await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().draft as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching draft content for ${sectorId}:`, error);
    return null;
  }
}

/**
 * Saves content to the draft staging area.
 */
export async function saveSectorDraft<T>(sectorId: SectorId, data: T) {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, sectorId);
    
    try {
      await updateDoc(docRef, {
        draft: data,
        updatedAt: Date.now()
      });
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'not-found') {
        await setDoc(docRef, {
          id: sectorId,
          published: data,
          draft: data,
          updatedAt: Date.now()
        });
      } else {
        throw e;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error saving draft for ${sectorId}:`, error);
    throw error;
  }
}

/**
 * Authorizes the current draft to be pushed to the live site.
 */
export async function publishSectorContent(sectorId: SectorId) {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, sectorId);
    const docSnap = await getDocFromServer(docRef);
    
    if (!docSnap.exists()) throw new Error("Manifest not found");
    
    const data = docSnap.data();
    if (!data.draft) throw new Error("No draft manifest available to publish");
    
    await updateDoc(docRef, {
      published: data.draft,
      updatedAt: Date.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error publishing content for ${sectorId}:`, error);
    throw error;
  }
}

/**
 * Subscribes to published content for real-time updates on the public pages.
 */
export function subscribeToSectorContent<T>(
  sectorId: SectorId, 
  callback: (data: T) => void
) {
  const docRef = doc(db, CONTENT_COLLECTION, sectorId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.published) {
        callback(data.published as T);
      }
    }
  });
}

/**
 * Subscribes to all sector manifests for the Admin Dashboard.
 */
export function subscribeToAllSectors(callback: (data: SiteSectorDoc[]) => void) {
  const colRef = collection(db, CONTENT_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const sectors = snapshot.docs.map(d => d.data() as SiteSectorDoc);
    callback(sectors);
  });
}
