import { HOST } from "@/api/fetchApi";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function ChatboxPage() {
  // Lấy page_id từ URL params
  const { page_id } = useParams<{ page_id: string }>();

  useEffect(() => {
    if (!page_id) {
      console.error("page_id is required");
      return;
    }

    // Kiểm tra nếu script đã được thêm vào trước đó
    const existingScript = document.querySelector(
      'script[src*="botbanhang.vn"]'
    );
    if (existingScript) {
      return;
    }

    // Tạo script element
    const script = document.createElement("script");
    script.src = HOST["chatbox_embed"];
    script.async = true;

    script.onload = () => {
      // Kiểm tra BBH đã tồn tại trên window chưa
      if (window.BBH) {
        window.BBH.init({
          page_id: page_id,
          config: {
            // Các config khác nếu cần
          },
        });

        console.log("BBH initialized with page_id:", page_id);

        // Gửi thông điệp đến iframe sau khi khởi tạo
        setTimeout(() => {
          const iframe = document.querySelector(
            "#BBH-EMBED-IFRAME"
          ) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            const dataToSend = {
              from: "parent-app",
              user_name: "Trường Lê",
              user_email: undefined,
              user_phone: "",
              client_id: "1a7b78c1d0094dd2945a5a3f4ae404a2",
            };
            iframe.contentWindow.postMessage(dataToSend, "*");
            console.log("Message sent to iframe:", dataToSend);
          }
        }, 1000);
      }
    };

    script.onerror = () => {
      console.error("Failed to load BBH script");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup khi component unmount
      document.body.removeChild(script);
      // Có thể thêm cleanup BBH nếu cần
    };
  }, [page_id]); // Chạy lại effect khi page_id thay đổi

  return null;
}

export default ChatboxPage;
