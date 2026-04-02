import Document, { DOCUMENT_CATEGORIES } from "../models/Document.js";

export async function getDocuments(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } }
    ];
  }

  const documents = await Document.find(filter)
    .populate("uploadedBy", "name department")
    .sort({ createdAt: -1 });

  res.json({ documents });
}

export async function createDocument(req, res) {
  const fileUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;
  if (!fileUrl) return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์เอกสาร" });

  const document = await Document.create({
    name: req.body.name,
    category: req.body.category,
    fileUrl,
    uploadedBy: req.user._id
  });

  const populated = await document.populate("uploadedBy", "name department");
  res.status(201).json({ document: populated });
}
