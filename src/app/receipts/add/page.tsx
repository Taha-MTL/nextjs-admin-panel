import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddReceipt from "@/components/Receipt/Add";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Receipt | NextAdmin",
  description: "This is Next.js Add Receipts page for NextAdmin Dashboard Kit",
};

const AddReceiptPage = () => {
  return (
    <>
      <DefaultLayout>
        <div className="mx-auto w-full max-w-[970px]">
          <Breadcrumb
            items={[
              { name: "Dashboard", href: "/" },
              { name: "Receipts", href: "/receipts" },
              { name: "Add Receipt", href: "" },
            ]}
          />
          <AddReceipt />
        </div>
      </DefaultLayout>
    </>
  );
};

export default AddReceiptPage;
