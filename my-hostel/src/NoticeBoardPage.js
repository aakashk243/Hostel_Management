import React from "react";
import NoticeBoard from "./components/NoticeBoard";
import AdminNotice from "./components/AdminNotice";

export default function NoticeBoardPage() {
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {role === "admin" && (
        <>
          <AdminNotice />
          <hr className="my-10" />
        </>
      )}

      <NoticeBoard />
    </div>
  );
}
