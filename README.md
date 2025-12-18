# 🚀 HỆ THỐNG BÁN QUẦN ÁO

Đây là kho lưu trữ chứa mã nguồn cho **[Mô tả ngắn gọn về dự án/Mục đích chính]**. Dự án được chia thành hai phần chính:

* **`./fe` (Frontend):** Giao diện người dùng được xây dựng bằng **ReactJS**.
* **`./be` (Backend):** API cung cấp dữ liệu, được xây dựng bằng **Spring Boot/Java**.

Thông tin hệ thống:
- **Backend:** [http://localhost:8080](http://localhost:8080)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

Thông tin Database:
- **URL:** [jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC]
- **Username:** root
- **Password:** Dang2004!

## 🛠 Yêu cầu hệ thống (Prerequisites)

Để khởi động và phát triển dự án, bạn cần cài đặt các công cụ sau trên máy:

* **Java Development Kit (JDK):** **[Phiên bản JDK: VD: 17+]** (Cho Backend)
* **Node.js & npm/yarn:** **[Phiên bản Node.js: VD: 18+]** (Cho Frontend)
* **Maven** (Chạy Spring Boot bằng Terminal)

## 💡 Thiết lập và Khởi động (Setup & Run)

Thao tác này bao gồm hai bước: Khởi động Backend (API) và Khởi động Frontend (Giao diện).

### 1. Khởi động Backend (Spring Boot)

Backend sẽ chạy trên cổng mặc định là **:8080** và cung cấp các API cho Frontend.

1.  Di chuyển vào thư mục backend:
    ```bash
    cd ./be
    ```
2.  Chạy ứng dụng bằng Maven Wrapper:
    ``` bash
    ./mvnw spring-boot:run
    ```

### 2. Khởi động Frontend ([ReactJS])

Frontend sẽ kết nối đến Backend vừa khởi động để lấy dữ liệu.

1.  Di chuyển vào thư mục frontend:
    ``` bash
    cd ./fe
    ```
2.  Cài đặt các thư viện phụ thuộc:
    ``` bash
    npm install
    ```
3.  Chạy ứng dụng (thường chạy trên cổng **[VD: 3000]**):
    ``` bash
    npm run dev
    ```

Sau khi cả hai phần đều chạy, bạn có thể truy cập ứng dụng qua trình duyệt tại địa chỉ: [http://localhost:3000](http://localhost:3000)
---
