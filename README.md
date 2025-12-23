# 🚀 CLOTHING SALES SYSTEM

This is the repository containing the source code for **[Brief project description/Main purpose]**. The project is divided into two main parts:

* **`./fe` (Frontend):** User interface built with **ReactJS**.
* **`./be` (Backend):** Data-providing API, built with **Spring Boot/Java**.

System information:
- **Backend:** [http://localhost:8080](http://localhost:8080)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

Database information:
- **URL:** [jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC]
- **Username:** root
- **Password:** Dang2004!

## 🛠 System Requirements (Prerequisites)

To start and develop the project, you need to install the following tools on your machine:

* **Java Development Kit (JDK):** **[JDK Version: e.g., 17+]** (For Backend)
* **Node.js & npm/yarn:** **[Node.js Version: e.g., 18+]** (For Frontend)
* **Maven** (Run Spring Boot via Terminal)

## 💡 Setup and Launch (Setup & Run)

This process includes two steps: Starting the Backend (API) and Starting the Frontend (Interface).

### 1. Start Backend (Spring Boot)

Backend will run on the default port **:8080** and provide APIs for the Frontend.

1.  Navigate to the backend directory:
    ```bash
    cd ./be
    ```
2.  Run the application using Maven Wrapper:
    ``` bash
    ./mvnw spring-boot:run
    ```

### 2. Start Frontend ([ReactJS])

Frontend will connect to the just-started Backend to fetch data.

1.  Navigate to the frontend directory:
    ``` bash
    cd ./fe
    ```
2.  Install the dependency libraries:
    ``` bash
    npm install
    ```
3.  Run the application (usually runs on port **[e.g., 3000]**):
    ``` bash
    npm run dev
    ```

After both parts are running, you can access the application through the browser at: [http://localhost:3000](http://localhost:3000)
---
