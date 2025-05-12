import React, { useState } from "react";
import { Form, Upload, Modal, message, Spin } from "antd";
import { useI18n } from "../../../providers/i18n";

const MultipleImageInput = (props) => {
  const [loading,setLoading]=useState(false);

  const max = props.max || 1;
  const name = props.name || "img";
  const label = props.label;
  const listType = props.listType || "picture-card";
  const i18n = useI18n();

  return (
    <div className="form-group">
     

      <Form.Item
        name={name}
        label={i18n?.t(label)}
        rules={[
          {
            required: props?.required,
            message: `${i18n?.t("Please upload")} ${
              label ? i18n?.t(label) : props?.video ? i18n?.t("a video") : i18n?.t("an image")
            }`,
          },
        ]}
      >
        
         {
      
          <Input
          max={max}
          listType={listType}
          pdf={loading?<Spin/>:props?.pdf}
          noWebp={loading?<Spin/>:props?.noWebp}
          video={loading?<Spin/>:props?.video}
          loading={loading}
          setLoading={setLoading}
        />
        
      }
      </Form.Item>
    </div>
  );
};

const Input = ({ value = [], onChange, listType, max, noWebp, pdf, video,loading,setLoading }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const i18n = useI18n();
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    
    try {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview || "");
      setPreviewVisible(true);
    } catch (error) {
      console.error("Error generating preview:", error);
      message.error("Failed to generate preview.");
    }
  };
  
  const handleChange = ({ fileList }) => {
    setLoading(true);
    const updatedFileList = fileList.map((file) => {
      if (file.response?.url) {
        setLoading(false);
        file.url = file.response.url; // Assign the URL from the server response
      } else if (file.originFileObj && !file.preview) {
  

        setLoading(false);
        getBase64(file.originFileObj).then((preview) => {
          file.preview = preview; // Generate a base64 preview
        });
      }
      return file;
    });
    onChange(updatedFileList); // Update the file list state
  };
  
  return (
    <>
      <Upload
        accept={`image/png, image/gif, image/jpeg, ${
          !noWebp ? "image/webp" : ""
        }${pdf ? ",application/pdf" : ""}${
          video ? ",video/mp4,application/mpeg,video/*" : ""
        }`}
        listType={listType}
        onPreview={handlePreview}
        fileList={value}
        onChange={handleChange}
        maxCount={max}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess({ url: URL.createObjectURL(file) }); // Create a temporary URL
            // message.success("Image uploaded successfully");
          }, 1000);
        }}
        
      >
        {value.length < max && `+ ${i18n?.t("Upload")}`}
      </Upload>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleCancel}
        title="Preview"
      >
        {video && previewImage.endsWith(".mp4") ? (
          <video width="100%" height="600" controls>
            <source src={previewImage} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : pdf && previewImage.endsWith(".pdf") ? (
          <embed
            src={previewImage}
            type="application/pdf"
            width="100%"
            height="600"
          />
        ) : (
          <img alt="preview_image" style={{ width: "100%" }} src={previewImage} />
        )}
      </Modal>
    </>
  );
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default MultipleImageInput;
