"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import fs from "fs/promises";
import path from "path";
import { useRouter } from "next/navigation";

export default function Home({ dirs }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageList, setImageList] = useState([]);

  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    // console.log(formData);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
        router.refresh();
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
    }
  };

  // useEffect(async () => {
  //   try {
  //     const images = await fs.readdir(
  //       path.join(process.cwd(), "/public/images")
  //     );
  //     setImgs(images);
  //   } catch (error) {}
  // }, []);
  useEffect(() => {
    const fetchImageList = async () => {
      try {
        const response = await fetch("/images"); // Replace with the appropriate API endpoint or URL
        const data = await response.json();
        console.log(data);
        // setImageList(data);
      } catch (error) {
        console.error("Error fetching image list:", error);
      }
    };

    fetchImageList();
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center">
      <input type="file" size="120" onChange={handleFileChange} />
      <button
        className="px-2 py-1 bg-slate-700 rounded-lg text-white ml-24"
        onClick={handleUpload}
      >
        Upload
      </button>
      {/* <Image
        className="px-4"
        src="/images/1687928056347_Edel the elephant.jpg"
        alt="elephant"
        width="124"
        height="124"
      /> */}
      <div className="px-4">
        <ul className="bg-gray-700 p-4 text-white">
          {dirs.map(
            (image, index) => (
              <li key={image} className="pt-1">
                <Link key={image} href={"/images/" + image}>
                  {image}
                </Link>
              </li>
            )
            // <Image key={index} src={`/images/${image}`} alt={image} />
          )}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "public/images"));
    props.dirs = dirs;
    return { props };
  } catch (error) {
    return { props };
  }
};
