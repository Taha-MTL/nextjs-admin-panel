import React, { useEffect } from "react";
import ClickOutside from "../ClickOutside";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteAlert: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="z-999 fixed inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 outline-none focus:outline-none">
      <ClickOutside onClick={onClose}>
        <div className="relative mx-auto my-6 w-auto max-w-sm">
          <div className="relative flex w-full flex-col rounded-lg bg-white shadow-lg outline-none focus:outline-none dark:bg-gray-800">
            <div className="flex items-start justify-between rounded-t p-5">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                {title}
              </h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none dark:text-white"
                onClick={onClose}
              >
                <span className="block h-6 w-6 text-2xl text-black dark:text-white">
                  ×
                </span>
              </button>
            </div>
            <div className="relative flex-auto p-6">
              <p className="my-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {message}
              </p>
            </div>
            <div className="flex items-center justify-end rounded-b p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DeleteAlert;
