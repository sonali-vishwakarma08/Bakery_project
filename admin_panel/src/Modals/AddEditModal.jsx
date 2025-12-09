import { useEffect, useState, useCallback } from "react";
import { Modal, Form, Input, Select, Upload, Row, Col } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

export default function AddEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields = [],
  data = {},
  imageFolder = "categories", // Default folder, can be overridden
}) {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Get base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const BASE_URL = API_BASE_URL.replace("/api", ""); // Remove /api to get base server URL

  const getFullImageUrl = useCallback((img) => {
    if (!img) return null;

    // If already a full URL, return as-is
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // If starts with /uploads/, it's already a full path
    if (img.startsWith("/uploads/")) {
      return `${BASE_URL}${img}`;
    }

    // Determine upload folder based on image field name and context
    let uploadFolder = imageFolder; // Use prop or default
    
    // Auto-detect folder from image field name
    if (data?.profile_image || data?.avatar) {
      uploadFolder = "users";
    }

    // If image contains path separators, use it as-is
    if (img.includes("/")) {
      const path = img.startsWith("/") ? img : `/${img}`;
      return `${BASE_URL}${path}`;
    }

    // Just a filename - construct path with detected/configured folder
    return `${BASE_URL}/uploads/${uploadFolder}/${img}`;
  }, [BASE_URL, imageFolder, data?.profile_image, data?.avatar]);

  // Load form + image on open
  useEffect(() => {
    if (!isOpen) return;
  
    form.resetFields();
  
    const img = data?.image || data?.profile_image || data?.images?.[0];
  
    if (img) {
      const fullUrl = getFullImageUrl(img);

      // Only set fileList if we have a valid URL
      if (fullUrl) {
        const fileName = img.split("/").pop() || img || "image.png";
        
        setFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: fullUrl, // Ant Design uses this for preview
            thumbUrl: fullUrl, // Required for picture-card display
            originFileObj: null, // no local file yet
          },
        ]);

        setPreviewImage(fullUrl);
      } else {
        setFileList([]);
        setPreviewImage(null);
      }
    } else {
      setFileList([]);
      setPreviewImage(null);
    }
  
    const formData = { ...data };
    delete formData.image;
    delete formData.profile_image;
    delete formData.images;
  
    form.setFieldsValue(formData);
  }, [data, isOpen, form, getFullImageUrl]);
  

  // SAVE handler
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (fileList.length > 0 && fileList[0].originFileObj) {
        values.image = fileList[0].originFileObj;
      } else if (fileList.length === 0) {
        values.image = null; // indicate image removal
      }

      onSave(values);
    });
  };

  // Upload button UI
  const uploadButton = (
    <div className="flex flex-col items-center">
      <PlusOutlined style={{ fontSize: 24 }} />
      <div style={{ fontSize: 12, marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Modal
        title={<span className="text-lg font-semibold">{title}</span>}
        open={isOpen}
        onCancel={() => {
          setFileList([]);
          setPreviewImage(null);
          form.resetFields();
          onClose();
        }}
        onOk={handleSave}
        okText="Save"
        width={750}
        centered
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          {/* IMAGE UPLOADER */}
          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false} // prevent auto-upload
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList || []);
              }}
              onPreview={(file) => {
                const previewUrl = file.url || file.thumbUrl || file.preview;
                if (previewUrl) {
                  setPreviewImage(previewUrl);
                  setPreviewOpen(true);
                }
              }}
              onRemove={() => {
                setFileList([]);
                setPreviewImage(null);
              }}
              accept="image/*"
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
                showPreviewIcon: true,
                showDownloadIcon: false,
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          {/* FORM FIELDS (2 columns) */}
          <Row gutter={16}>
            {fields
              .filter((field) => field.type !== "file" && field.type !== "image")
              .map((field, index) => (
                <Col span={12} key={index}>
                  <Form.Item
                    label={field.label}
                    name={field.name}
                    rules={[
                      {
                        required: field.required,
                        message: `${field.label} is required`,
                      },
                    ]}
                  >
                    {field.type === "select" ? (
                      <Select placeholder={`Select ${field.label}`}>
                        {field.options?.map((opt, i) => (
                          <Select.Option key={i} value={opt.value}>
                            {opt.label}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Input.TextArea rows={3} />
                    ) : (
                      <Input type={field.type || "text"} />
                    )}
                  </Form.Item>
                </Col>
              ))}
          </Row>
        </Form>
      </Modal>

      {/* PREVIEW POPUP */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={600}
        title="Image Preview"
      >
        {previewImage && (
          <img 
            alt="Preview" 
            style={{ width: "100%", display: "block" }} 
            src={previewImage}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
        )}
        <div style={{ display: "none", textAlign: "center", padding: "20px" }}>
          Failed to load image
        </div>
      </Modal>
    </>
  );
}
