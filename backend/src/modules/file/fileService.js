import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

class FileService {
    saveFile(file) {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.name).toLowerCase();

        if (!allowedTypes.includes(ext)) {
            throw new Error('Unsupported file type');
        }

        const fileName = uuidv4() + ext;
        const filePath = path.resolve('public/static', fileName);

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        console.log('PATH:', filePath)

        return new Promise((resolve, reject) => {
            file.mv(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('File moved successfully!')
                    resolve(fileName);
                }
            });
        });
    }
}

export default new FileService();
