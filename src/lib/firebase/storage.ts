import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/lib/firebase/config";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadFile(path: string, file: File, onProgress?: (percent: number) => void, maxRetries = 3) {
    const storageRef = ref(storage, path);

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt <= maxRetries) {
        try {
            await new Promise<void>((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        if (onProgress && snapshot.totalBytes) {
                            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            try { onProgress(percent); } catch (_) { }
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        resolve();
                    }
                );
            });

            return await getDownloadURL(storageRef);
        } catch (err) {
            lastError = err;
            attempt += 1;
            if (attempt > maxRetries) break;
            // exponential backoff
            const delay = 500 * Math.pow(2, attempt);
            await sleep(delay);
        }
    }

    throw lastError;
}
