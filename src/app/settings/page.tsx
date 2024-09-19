import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SettingBoxes from "@/components/SettingBoxes";

export const metadata: Metadata = {
  title: "Settings | NextAdmin",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb   items={[
              { name: "Dashboard", href: "/" },
              { name: "Settings", href: "" },
            ]} />

        <SettingBoxes />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
