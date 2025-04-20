import React, { useState, useEffect } from "react";

export const ResponsiveComponent = () => {
  // state để lưu kích thước màn hình
  const [screenSize, setScreenSize] = useState("sm");

  // Hàm cập nhật trạng thái screenSize khi cửa sổ thay đổi kích thước
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setScreenSize("lg");
    } else if (window.innerWidth >= 768) {
      setScreenSize("md");
    } else {
      setScreenSize("sm");
    }
  };

  // useEffect để lắng nghe sự kiện resize khi component mount
  useEffect(() => {
    handleResize(); // cập nhật khi load lần đầu
    window.addEventListener("resize", handleResize); // thêm sự kiện resize

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <h1>Current Screen Size: {screenSize}</h1>
      <div>
        {screenSize === "lg" && <p>Đây là màn hình lớn (lg)</p>}
        {screenSize === "md" && <p>Đây là màn hình vừa (md)</p>}
        {screenSize === "sm" && <p>Đây là màn hình nhỏ (sm)</p>}
      </div>
    </div>
  );
};
