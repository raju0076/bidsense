"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VendorCreateModal from "../../components/VendorCreateModal"
export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const refresh = () => {};

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => router.push("/vendors"), 10);
  };

  return (
    <>
      {open && (
        <VendorCreateModal
          onClose={closeModal}
          refresh={refresh}
        />
      )}
    </>
  );
}
