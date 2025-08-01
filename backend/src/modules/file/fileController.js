import FileService from './fileService.js';

class FileController {
    async saveFile(req, res) {
        try {
            console.log('FILES:', req.files);
            console.log('BODY:', req.body);

            const file = req.files?.image;

            if (!file) {
                return res.status(400).json({ success: 0, error: 'No file uploaded' });
            }

            const fileName = await FileService.saveFile(file);
            const fileUrl = `${process.env.API_URL}/static/${fileName}`;


            return res.status(200).json({
                success: 1,
                file: {
                    url: fileUrl,
                },
            });
        } catch (e) {
            console.error('File upload error:', e.message);
            return res.status(500).json({ success: 0, error: e.message });
        }
    }
}

export default new FileController();
