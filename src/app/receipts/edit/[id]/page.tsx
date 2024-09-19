import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditReceipt from "@/components/Receipt/Edit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Receipt | NextAdmin",
  description: "This is Next.js Edit Receipt page for NextAdmin Dashboard Kit",
};

const EditReceiptPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Receipts", href: "/receipts" },
            { name: "Edit Receipt", href: "" },
          ]}
        />
        <EditReceipt />
      </div>
    </DefaultLayout>
  );
};

export default EditReceiptPage;
