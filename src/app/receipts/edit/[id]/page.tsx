import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditReceipt from "@/components/Receipt/Edit";

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
