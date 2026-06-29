export type UserRole = "admin" | "user";
export type PostStatus = "draft" | "published";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    role: UserRole;
    createdAt: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content?: string; // Kept for UI compatibility, maybe mapped from local or another field
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string | string[]; // Firestore has string, UI expects string[]
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    views: number;
    likes: number;
    commentsCount?: number;
    readTime?: number;
    readingTime?: number; // Kept for UI compatibility
    status: PostStatus | string;
    featured?: boolean;
    published?: boolean;
    local?: string;
    summary?: string;
    ceateAt?: any; // Firestore timestamp
    createdAt: string | any;
    updatedAt: string | any;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export interface Bookmark {
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
}
