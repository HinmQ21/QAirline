import { NewsManageContent } from "./NewsManage"

export const AdminDashboardContent = ({index}) => {
  switch (index) {
    case 1:
      return <NewsManageContent />;
    default:
      return <div>Page {index}</div>
  }
}