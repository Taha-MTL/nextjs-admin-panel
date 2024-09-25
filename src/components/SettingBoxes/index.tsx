"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Person,
  Work,
  Email,
  AccountCircle,
  Edit,
  Close,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import Loader from "../Loader/Subtle";
import { dismissToast, showToast } from "../Toast";
import UserData from "@/interface/userData.interface";

interface FormData {
  fullName: string;
  title: string;
  emailAddress: string;
  username: string;
  bio: string;
}

interface PhotoData {
  photoURL: string | null;
}

const SettingBoxes: React.FC = () => {
  const [userId, setUserId] = useState<string | undefined>(
    auth.currentUser?.uid,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null); // State for image preview
  const storage = getStorage();

  const {
    register: registerPersonalInfo,
    handleSubmit: handlePersonalSubmit,
    setValue: setPersonalValue,
    formState: { errors: personalErrors },
  } = useForm<FormData>();

  const {
    register: registerPhoto,
    handleSubmit: handlePhotoSubmit,
    formState: { errors: photoErrors },
  } = useForm<PhotoData>();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        if (userId) {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.data() as FormData & PhotoData;
          Object.keys(userData).forEach((key) => {
            setPersonalValue(
              key as keyof FormData,
              userData[key as keyof FormData],
            );
          });
          setPhotoURL(userData.photoURL || null);
          setUserId(userId);
        } else {
          dismissToast();
          showToast("error", "User not found");
        }
      } catch (e) {
        showToast("error", "Something went wrong");
        console.error("Sign in error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser]);

  const onSubmitPersonalInfo = async (data: FormData) => {
    try {
      setLoading(true);
      await setDoc(doc(db, "users", userId as string), data, { merge: true });
      showToast("success", "Personal information updated successfully");
    } catch (error) {
      console.error("Error updating personal information:", error);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validExtensions = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!validExtensions.includes(file.type)) {
        showToast("error", "Invalid file type. Only images are allowed.");
        return;
      }

      const previewURL = URL.createObjectURL(file);
      setPreviewURL(previewURL);
    }
  };

  const onSubmitPhoto = async (data: PhotoData) => {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      showToast("error", "File not found");
      return;
    }

    try {
      setLoading(true);
      const storageRef = ref(storage, `profilePhotos/${userId}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(
        doc(db, "users", userId as string),
        { photoURL: downloadURL },
        { merge: true },
      );

      setPhotoURL(downloadURL);
      showToast("success", "Profile picture updated successfully");
      setPreviewURL(null);
    } catch (error) {
      console.error("Error updating photo:", error);
      showToast(
        "error",
        "Something went wrong while saving the profile picture.",
      );
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handlePersonalSubmit(onSubmitPersonalInfo)}>
                <div className="mb-4 flex flex-col gap-5.5 sm:flex-row">
                  <div className="mb-4 w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <div className="relative flex h-12 items-center">
                      <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                        <Person />
                      </span>
                      <input
                        className={`w-full rounded-[7px] border-[1.5px] ${
                          personalErrors.fullName
                            ? "border-red-500"
                            : "border-stroke focus:border-primary dark:border-dark-3 dark:focus:border-primary"
                        } bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus-visible:outline-none dark:bg-dark-2 dark:text-white`}
                        type="text"
                        {...registerPersonalInfo("fullName", {
                          required: "Full name is required",
                        })}
                      />
                    </div>
                    {personalErrors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {personalErrors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="title"
                    >
                      Title
                    </label>
                    <div className="relative flex h-12 items-center">
                      <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                        <Work />
                      </span>
                      <input
                        className={`w-full rounded-[7px] border-[1.5px] ${
                          personalErrors.title
                            ? "border-red-500"
                            : "border-stroke focus:border-primary dark:border-dark-3 dark:focus:border-primary"
                        } bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus-visible:outline-none dark:bg-dark-2 dark:text-white`}
                        type="text"
                        {...registerPersonalInfo("title", {
                          required: "Title is required",
                        })}
                      />
                    </div>
                    {personalErrors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {personalErrors.title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-5.5 sm:flex-row">
                  <div className="mb-4 w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <div className="relative flex h-12 items-center">
                      <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                        <Email />
                      </span>
                      <input
                        className={`w-full rounded-[7px] border-[1.5px] ${
                          personalErrors.emailAddress
                            ? "border-red-500"
                            : "border-stroke focus:border-primary dark:border-dark-3 dark:focus:border-primary"
                        } bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus-visible:outline-none dark:bg-dark-2 dark:text-white`}
                        type="email"
                        {...registerPersonalInfo("emailAddress", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    {personalErrors.emailAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {personalErrors.emailAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <div className="relative flex h-12 items-center">
                      <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                        <AccountCircle />
                      </span>
                      <input
                        className={`w-full rounded-[7px] border-[1.5px] ${
                          personalErrors.username
                            ? "border-red-500"
                            : "border-stroke focus:border-primary dark:border-dark-3 dark:focus:border-primary"
                        } bg-white py-2.5 pl-12.5 pr-4.5 text-dark focus-visible:outline-none dark:bg-dark-2 dark:text-white`}
                        type="text"
                        {...registerPersonalInfo("username", {
                          required: "Username is required",
                        })}
                      />
                    </div>
                    {personalErrors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {personalErrors.username.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <textarea
                    className={`w-full rounded-[7px] border-[1.5px] ${
                      personalErrors.bio
                        ? "border-red-500"
                        : "border-stroke focus:border-primary dark:border-dark-3 dark:focus:border-primary"
                    } bg-white px-4.5 py-2.5 text-dark focus-visible:outline-none dark:bg-dark-2 dark:text-white`}
                    rows={5}
                    {...registerPersonalInfo("bio")}
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Avatar and upload section */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Profile Picture
              </h3>
            </div>
            <form onSubmit={handlePhotoSubmit(onSubmitPhoto)}>
              <div className="flex flex-col items-center p-7">
                {photoURL ? (
                  <Image
                    src={photoURL}
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                ) : (
                  <Avatar sx={{ width: 150, height: 150 }} alt="User Avatar" />
                )}

                <div className="my-5"></div>

                {/* File upload input */}
                <div
                  id="FileUpload"
                  className={`relative mb-4 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5 ${photoErrors.photoURL ? "border-red-500" : ""}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    {...registerPhoto("photoURL", {
                      required: "Please select an image first.",
                    })}
                    onChange={handlePhotoUpload}
                  />
                  {photoErrors.photoURL && (
                    <p className="text-red-500">
                      {photoErrors.photoURL.message}
                    </p>
                  )}

                  <div className="flex flex-col items-center justify-center">
                    <IconButton>
                      <Edit />
                    </IconButton>
                    <p className="mt-2.5 text-body-sm font-medium">
                      <span className="text-primary">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1 text-body-xs">
                      PNG, JPG, JPEG, GIF (max. 800x800px)
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {previewURL && (
                  <div className="relative mt-4">
                    <div className="mb-2 flex justify-end">
                      <IconButton
                        className="rounded-full bg-white dark:bg-gray-800"
                        onClick={() => {
                          setPreviewURL(null);
                          const fileInput = document.querySelector(
                            'input[type="file"]',
                          ) as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = "";
                          }
                        }}
                      >
                        <Close />
                      </IconButton>
                    </div>
                    <Image
                      src={previewURL}
                      alt="Preview"
                      width={150}
                      height={150}
                      className="rounded-full"
                    />
                  </div>
                )}

                <button
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                  type="submit"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingBoxes;
