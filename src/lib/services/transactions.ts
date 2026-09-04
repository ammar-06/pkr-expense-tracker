import { db } from "@/lib/firebase/config";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { Transaction } from "@/types/finance";

const getTransactionsRef = (userId: string) => collection(db, `users/${userId}/transactions`);

export const addTransaction = async (userId: string, data: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => {
  const ref = getTransactionsRef(userId);
  const now = Date.now();
  const docRef = await addDoc(ref, {
    ...data,
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const updateTransaction = async (userId: string, transactionId: string, data: Partial<Transaction>) => {
  const ref = doc(db, `users/${userId}/transactions`, transactionId);
  await updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const ref = doc(db, `users/${userId}/transactions`, transactionId);
  await deleteDoc(ref);
};

export const getTransactions = async (userId: string, type?: "expense" | "income", limitCount: number = 100): Promise<Transaction[]> => {
  let q = query(getTransactionsRef(userId), orderBy("date", "desc"), orderBy("createdAt", "desc"));
  
  if (type) {
    q = query(getTransactionsRef(userId), where("type", "==", type), orderBy("date", "desc"), orderBy("createdAt", "desc"));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
};
