const Upload = require("../models/uploads.model");
const User = require("../models/user.model");
const path = require("path");
const fs = require("fs");
const redisClient = require("../util/redisClient");
const uploadFile = async (req, res) => {
  const sizeKB = (req.file.size / 1024).toFixed(2);
  const sizeMB = (req.file.size / (1024 * 1024)).toFixed(2);
  const fileData = {
    user: req.user.id,
    owner: req.user.name,
    name: req.file.originalname,
    type: req.file.mimetype,
    path: req.file.path,
    sizeKB,
    sizeMB,
    date: new Date(),
    sharedWith: [],
  };
  const uploaded = await Upload.upload(fileData);
  if (uploaded) {
    await redisClient.del(`archive:${req.user.id}`);
    res.status(200).json({ message: "File uploaded successfully" });
  } else {
    res.status(400).json({ error: "Failed to upload file to database" });
  }
};

const downloadFile = async (req, res) => {
  const { id } = req.params;
  const file = await Upload.findFileById(id);
  const isOwner = file.user.toString() === req.user.id.toString();
  const isShared = file.sharedWith.some(
    (shareId) => shareId.toString() === req.user.id.toString(),
  );
  if (isOwner || isShared) {
    const filePath = path.join(__dirname, "..", file.path.toString());
    return res.sendFile(filePath);
  }
  res.status(403).json({ error: "not authorized" });
  return;
};

const viewFile = async (req, res) => {
  // 1. Authentication Check
  if (!req.user) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const { id } = req.params;
  const file = await Upload.findFileById(id);

  if (!file) {
    return res.status(404).json({ error: "file not found" });
  }

  // 2. Authorization Logic
  const isOwner = file.user.toString() === req.user.id.toString();

  // Convert ObjectIds to strings to accurately compare with req.user.id
  const isShared = file.sharedWith.some(
    (shareId) => shareId.toString() === req.user.id.toString(),
  );

  if (isOwner || isShared) {
    // 3. Absolute Path Resolution
    const filePath = path.resolve(__dirname, "..", file.path);
    return res.sendFile(filePath);
  }

  // 4. Fallback if neither owner nor shared
  return res.status(403).json({ error: "not authorized" });
};

const deleteFile = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "not authenticated" });
    return;
  }
  const { id } = req.params;
  const file = await Upload.findFileById(id);
  if (file.user.toString() !== req.user.id.toString()) {
    res.status(403).json({ error: "not authorized" });
    return;
  }
  const filePath = path.join(__dirname, "..", file.path.toString());
  await Upload.deleteFile(id);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("error deleting file err:", err);
    }
  });
  await redisClient.del(`archive:${req.user.id}`);
  return res.status(200).json({ message: "File deleted successfully" });
};

const getArchive = async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }
  const files = await Upload.getUserFilesInOrder(req.user.id);
  const groupedFiles = await Upload.groupAllFiles(req.user.id, files);
  res.status(200).json({ user: req.user.name, files: groupedFiles });
};

const getFiles = async (req, res) => {
  const files = await Upload.getRecentFiles(req.user.id);
  res.status(200).json({ user: req.user.name, files });
};

const findUser = async (req, res) => {
  const { email } = req.params;
  const user = await User.findUserByEmail(email.trim());
  user
    ? res.status(200).json({ message: "user found", user: user })
    : res.status(404).json({ message: "user not found" });
};

const shareFile = async (req, res) => {
  const { userID } = req.body;
  const file = await Upload.findFileById(req.params.id);
  if (file.user.toString() !== req.user.id)
    return res.status(403).json({ message: "only users can share files" });

  (await Upload.shareFile(req.params.id, userID))
    ? res.status(200).json({ message: "File shared" })
    : res.status(401).json({ message: "Error sharing file" });
};

const getSharedFiles = async (req, res) => {
  const { id } = req.params;
  const files = await Upload.getSharedFiles(id);
  res.status(200).json({ message: "files grouped", files });
};

const sharedBy = async (req, res) => {
  const { id } = req.params;
  const sharedBy = await User.sharedBy(id);
  res.status(200).json({ message: "found", sharedBy });
};

module.exports = {
  uploadFile,
  downloadFile,
  viewFile,
  deleteFile,
  getArchive,
  getFiles,
  findUser,
  shareFile,
  getSharedFiles,
  sharedBy,
};
