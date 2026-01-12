import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

type UploadFolder = "banners" | "categories" | "products" | "store";

export class UploadHandler {
    static async saveFile(file: File, folder: UploadFolder): Promise<string> {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = join(process.cwd(), "uploads");
        const targetDir = join(uploadsDir, folder);

        await mkdir(targetDir, { recursive: true });

        const extension = file.name.split(".").pop() || "jpg";
        const filename = `${uuidv4()}.${extension}`;
        const filePath = join(targetDir, filename);

        await writeFile(filePath, buffer);

        return `uploads/${folder}/${filename}`;
    }

    static async deleteFile(relativePath: string): Promise<boolean> {
        if (!relativePath) return false;

        try {
            const fullPath = join(process.cwd(), relativePath);
            await unlink(fullPath);
            return true;
        } catch (error) {
            console.error(`[UploadHandler] Failed to delete file: ${relativePath}`, error);
            return false;
        }
    }
}
