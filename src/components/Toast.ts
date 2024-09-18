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
): void => {
  const defaultOptions: ToastOptions = {
    duration: 3000,
    position: "top-right",
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, defaultOptions);
      break;
    case "error":
      toast.error(message, defaultOptions);
      break;
    case "loading":
      toast.loading(message, defaultOptions);
      break;
    default:
      toast(message, defaultOptions);
  }
};

export default showToast;
