import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import type { Post } from "@/src/types";

// Helper to convert Firestore Timestamps to strings
const serializeData = (data: any) => {
    const serialized = { ...data };
    if (serialized.ceateAt && typeof serialized.ceateAt.toDate === 'function') {
        serialized.ceateAt = serialized.ceateAt.toDate().toISOString();
    }
    if (serialized.createdAt && typeof serialized.createdAt.toDate === 'function') {
        serialized.createdAt = serialized.createdAt.toDate().toISOString();
    }
    if (serialized.updatedAt && typeof serialized.updatedAt.toDate === 'function') {
        serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
    }
    return serialized;
};

export async function createPost(post: Omit<Post, "id">) {
    return addDoc(collection(db, "blog"), post);
}

export async function getPostBySlug(slug: string) {
    try {
        const q = query(collection(db, "blog"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const docSnapshot = snapshot.docs[0];
        return { id: docSnapshot.id, ...serializeData(docSnapshot.data()) } as Post & { id: string };
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}

export async function getPosts() {
    try {
        const snapshot = await getDocs(collection(db, "blog"));
        return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...serializeData(docSnapshot.data()) }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostById(id: string) {
    try {
        const snapshot = await getDoc(doc(db, "blog", id));
        return snapshot.exists() ? { id: snapshot.id, ...serializeData(snapshot.data()) } : null;
    } catch (error) {
        console.error("Error fetching post by id:", error);
        return null;
    }
}

export async function updatePost(id: string, updates: Partial<Post>) {
    await updateDoc(doc(db, "blog", id), updates);
}

export async function deletePost(id: string) {
    await deleteDoc(doc(db, "blog", id));
}

export async function getPostsByAuthor(authorId: string) {
    try {
        const q = query(collection(db, "blog"), where("authorId", "==", authorId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...serializeData(docSnapshot.data()) }));
    } catch (error) {
        console.error("Error fetching posts by author:", error);
        return [];
    }
}
