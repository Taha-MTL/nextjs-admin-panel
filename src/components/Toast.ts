import toast, { Toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "default";

interface ToastOptions {
  duration?: number;
  position?: Toast["position"];
}

const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {},
): string => {
  const defaultOptions: ToastOptions = {
    duration: 3000,
    position: "top-center",
    ...options,
  };

  let toastId: string;

  switch (type) {
    case "success":
      toastId = toast.success(message, defaultOptions);
      break;
    case "error":
      toastId = toast.error(message, defaultOptions);
      break;
    case "loading":
      toastId = toast.loading(message, defaultOptions);
      break;
    default:
      toastId = toast(message, defaultOptions);
  }

  return toastId;
};

const dismissToast = (toastId?: string): void => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

export { showToast, dismissToast };
