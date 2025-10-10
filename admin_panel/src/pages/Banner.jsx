
import GenericTable from "../table/GenericTable";

export default function BannerPage() {
  const columns = [
    { header: "Banner ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Image URL", accessor: "image" },
    { header: "Status", accessor: "status" },
  ];

  const data = [
    { id: 1, title: "Diwali Offer", image: "banner1.jpg", status: "Active" },
    { id: 2, title: "New Year Sale", image: "banner2.jpg", status: "Inactive" },
  ];

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Banners"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing ${row.title}`)}
          onEdit={(row) => alert(`Editing ${row.title}`)}
          onDelete={(row) => alert(`Deleting ${row.title}`)}
        />
      </div>
    </div>
  );
}
