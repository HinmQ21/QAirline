import { NewsManagerPage } from "./news-manager/page"

export const AdminDashboardContent = ({index}) => {
  switch (index) {
    case 1:
      return <NewsManagerPage />;
    default:
      return <div>Page {index}</div>
  }
}