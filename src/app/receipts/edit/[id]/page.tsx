import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditReceipt from "@/components/Receipt/Edit";

const EditReceiptPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Receipts", href: "/receipts" },
          { name: "Edit Receipt", href: "" },
        ]}
      />
      <div className="p-6">
        <EditReceipt />
      </div>
    </DefaultLayout>
  );
};

export default EditReceiptPage;
