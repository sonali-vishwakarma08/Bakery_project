import { Modal, Descriptions, Empty, Button, Avatar } from "antd";

export default function ViewModal({ isOpen, onClose, title, data = {} }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const BASE_URL = API_BASE_URL.replace("/api", "");

  // Format date to show only date and time (YYYY-MM-DD HH:MM:SS)
  const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return "—";
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return null;

    if (img.startsWith("http://") || img.startsWith("https://")) return img;

    if (img.startsWith("/uploads/")) return `${BASE_URL}${img}`;

    // Try common upload folders
    const possibleFolders = ["categories", "subcategories", "products", "banners", "users"];
    for (const folder of possibleFolders) {
      // If image path contains folder name, use it
      if (img.includes(folder)) {
        return `${BASE_URL}/uploads/${folder}/${img.split("/").pop()}`;
      }
    }
    
    // Default to categories if no match
    return `${BASE_URL}/uploads/categories/${img}`;
  };

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object" && !Array.isArray(value))
      return JSON.stringify(value, null, 2);
    return String(value);
  };

  // Filter out unwanted fields and format dates
  const filteredData = (() => {
    if (!data || Object.keys(data).length === 0) return {};
    
    const {
      __v: _v,
      v: _version,
      createdBy: _createdBy,
      created_by: _created_by,
      CreatedBy: _CreatedBy,
      ...rest
    } = data;
    
    const formatted = { ...rest };
    
    // Format date fields
    if (formatted.createdAt) {
      formatted.createdAt = formatDateTime(formatted.createdAt);
    }
    if (formatted.updatedAt) {
      formatted.updatedAt = formatDateTime(formatted.updatedAt);
    }
    if (formatted.CreatedAt) {
      formatted.CreatedAt = formatDateTime(formatted.CreatedAt);
    }
    if (formatted.UpdatedAt) {
      formatted.UpdatedAt = formatDateTime(formatted.UpdatedAt);
    }
    
    return formatted;
  })();

  const rawImage =
    filteredData?.profile_image || filteredData?.image || filteredData?.avatar || null;

  const userImage = getFullImageUrl(rawImage);

  return (
    <Modal
      title={<span className="text-lg font-semibold">{title}</span>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} type="default">Close</Button>,
      ]}
      centered
      width={700}
    >
      {/* TOP IMAGE */}
      {userImage && (
        <div className="flex justify-center mb-5">
          <Avatar
            src={userImage}
            size={120}
            style={{
              border: "3px solid #f0f0f0",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      {/* DETAILS */}
      {Object.keys(filteredData).length === 0 ? (
        <div className="py-8">
          <Empty description="No details available" />
        </div>
      ) : (
        <Descriptions
          bordered
          column={2}
          size="middle"
          labelStyle={{ fontWeight: 600 }}
          contentStyle={{ fontWeight: 500 }}
        >
          {Object.entries(filteredData).map(([key, value]) => {
            if (["profile_image", "image", "avatar"].includes(key)) return null;

            return (
              <Descriptions.Item label={formatKey(key)} key={key}>
                {formatValue(value)}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      )}
    </Modal>
  );
}
