import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ReceiptList from "@/components/Receipt/List";

const ReceiptsListPage = () => {
  return (
    <>
      <DefaultLayout>
        <div className="mx-auto w-full max-w-[970px]">
          <Breadcrumb
            items={[
              { name: "Dashboard", href: "/" },
              { name: "Receipts", href: "/receipts" },
            ]}
          />
          <ReceiptList />
        </div>
      </DefaultLayout>
    </>
  );
};

export default ReceiptsListPage;
