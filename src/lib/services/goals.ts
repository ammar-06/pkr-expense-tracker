import { db } from "@/lib/firebase/config";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc,
  updateDoc
} from "firebase/firestore";
import { SavingsGoal } from "@/types/finance";

const getGoalsRef = (userId: string) => collection(db, `users/${userId}/savingsGoals`);

export const addGoal = async (userId: string, data: Omit<SavingsGoal, "id" | "userId" | "createdAt">) => {
  const ref = getGoalsRef(userId);
  const docRef = await addDoc(ref, {
    ...data,
    userId,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateGoal = async (userId: string, goalId: string, data: Partial<SavingsGoal>) => {
  const ref = doc(db, `users/${userId}/savingsGoals`, goalId);
  await updateDoc(ref, {
    ...data,
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const ref = doc(db, `users/${userId}/savingsGoals`, goalId);
  await deleteDoc(ref);
};
