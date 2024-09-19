import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ReceiptList from "@/components/Receipt/List";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Receipts | NextAdmin",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const ReceiptsListPage = () => {
  return (
    <>
      <DefaultLayout>
        <div className="mx-auto w-full max-w-[970px]">
          <Breadcrumb
            items={[
              { name: "Dashboard", href: "/" },
              { name: "Receipts", href: "" },
            ]}
          />
          <ReceiptList />
        </div>
      </DefaultLayout>
    </>
  );
};

export default ReceiptsListPage;
