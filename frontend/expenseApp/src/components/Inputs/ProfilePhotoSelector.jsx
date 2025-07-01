import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // If image is a string (from backend), show it
    if (typeof image === "string") {
      setPreviewUrl(image);
    }
    // If it's a File (selected new), create a URL
    else if (image instanceof File) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(event.target);
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl && typeof image !== "string" ? (
        // No image at all - show placeholder
        <div className="w-20 h-20 flex items-center justify-center bg-[#E6F4E7] rounded-full relative">
          <LuUser className="text-4xl text-[#4d9c51]" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-[#4d9c51] text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        // Either previewUrl or existing image URL from backend
        <div className="relative">
          <img
            src={previewUrl || image}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
