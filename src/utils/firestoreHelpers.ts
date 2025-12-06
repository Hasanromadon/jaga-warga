import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

/**
 * Add document to Firestore collection
 * @param collectionName Nama collection
 * @param data Data yang akan ditambahkan
 * @param addTimestamp Tambahkan created_at timestamp (default: true)
 * @returns Document ID atau null jika gagal
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
  addTimestamp = true,
): Promise<string | null> {
  try {
    const docData = addTimestamp
      ? { ...data, created_at: serverTimestamp() }
      : data;

    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    return null;
  }
}

/**
 * Update document di Firestore
 * @param collectionName Nama collection
 * @param docId Document ID
 * @param data Data yang akan diupdate
 * @param addTimestamp Tambahkan updated_at timestamp (default: true)
 * @returns true jika berhasil, false jika gagal
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  addTimestamp = true,
): Promise<boolean> {
  try {
    const docData = addTimestamp
      ? { ...data, updated_at: serverTimestamp() }
      : data;

    await updateDoc(doc(db, collectionName, docId), docData);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
}

/**
 * Delete document dari Firestore
 * @param collectionName Nama collection
 * @param docId Document ID
 * @returns true jika berhasil, false jika gagal
 */
export async function deleteDocument(
  collectionName: string,
  docId: string,
): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return false;
  }
}

/**
 * Get single document dari Firestore
 * @param collectionName Nama collection
 * @param docId Document ID
 * @returns Document data dengan id atau null jika tidak ditemukan
 */
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
): Promise<(T & { id: string }) | null> {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }

    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return null;
  }
}

/**
 * Query documents dari Firestore dengan filter
 * @param collectionName Nama collection
 * @param filters Array of query constraints
 * @returns Array of documents dengan id
 */
export async function queryDocuments<T extends DocumentData>(
  collectionName: string,
  ...filters: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  try {
    const q = query(collection(db, collectionName), ...filters);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    return [];
  }
}

/**
 * Get all documents dari collection
 * @param collectionName Nama collection
 * @returns Array of documents dengan id
 */
export async function getAllDocuments<T extends DocumentData>(
  collectionName: string,
): Promise<(T & { id: string })[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error getting all documents from ${collectionName}:`, error);
    return [];
  }
}

/**
 * Query document by field value
 * @param collectionName Nama collection
 * @param field Field name
 * @param value Field value
 * @returns Array of matching documents
 */
export async function queryByField<T extends DocumentData>(
  collectionName: string,
  field: string,
  value: unknown,
): Promise<(T & { id: string })[]> {
  return queryDocuments<T>(collectionName, where(field, '==', value));
}
