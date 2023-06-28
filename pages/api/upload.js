// import formidable from "formidable";
// import fs from "fs";
// import path from "path";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).json({ error: "Method Not Allowed" });
//     return;
//   }

//   const form = new formidable();

//   form.parse(req, (error, fields, files) => {
//     if (error) {
//       console.error("An error occurred during file upload:", error);
//       res.status(500).json({ error: "Failed to process file upload" });
//       return;
//     }

//     const file = files.file;

//     if (!file) {
//       res.status(400).json({ error: "No file uploaded" });
//       return;
//     }

//     const filePath = path.join(process.cwd(), "public", file.name);

//     fs.writeFile(filePath, file.data, (error) => {
//       if (error) {
//         console.error("An error occurred during file save:", error);
//         res.status(500).json({ error: "Failed to save file" });
//       } else {
//         res.status(200).json({ message: "File uploaded and saved" });
//       }
//     });
//   });
// }
// const fs = require("fs");
// const { NextResponse } = require("next/server");

// async function POST(req) {
//   const formData = await req.formData();
//   const formDataEntryValues = Array.from(formData.values());
//   for (const formDataEntryValue of formDataEntryValues) {
//     if (
//       typeof formDataEntryValue === "object" &&
//       "arrayBuffer" in formDataEntryValue
//     ) {
//       const file = formDataEntryValue;
//       const buffer = Buffer.from(await file.arrayBuffer());
//       fs.writeFileSync(`public/${file.name}`, buffer);
//     }
//   }
//   return NextResponse.json({ success: true });
// }

// module.exports = POST;

import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};
const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;
