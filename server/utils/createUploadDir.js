// src/utils/createUploadDir.js
import fs from 'fs';
import path from 'path';

const createUploadDir = () => {
  const dir = path.join(process.cwd(), 'uploads/profileImages/');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export default createUploadDir;
