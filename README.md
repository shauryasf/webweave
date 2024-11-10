
# WebWeave
<img src="https://github.com/user-attachments/assets/bcf5425e-ded7-4128-8f02-30c01aaa2ada" alt="logo" width="100" height="100">

**WebWeave** is a powerful no-code website builder with a user-friendly drag-and-drop interface, allowing users to create, customize, and deploy websites effortlessly. Designed for flexibility and collaboration, WebWeave offers a range of features from live team editing to one-click hosting.

## 🌐 Features

-   **Drag and Drop Functionality**: Easily move and position elements on the canvas.
-  **Email Authentication**: Secure signup and login through email-based authentication.
-   **100% Customizable Elements**: Edit every detail of any element for complete control.
-   **Custom Elements and Code**: Add custom HTML, CSS, and JavaScript to personalize your site.
-   **Template Imports**: Import template codes to kickstart your project.
-   **Live Team Collaboration**: Work with your team in real time to build and refine your website.
-   **One-Click Hosting on Vercel**: Deploy your project instantly to Vercel with a single click.
-   **Code Export**: Export the complete code of your website for further customization.
-   **AI Code Generation**: Generate code snippets using AI directly within the editor.
-   **Responsive Design Testing**: Check your site's responsiveness right in the editor.

## 🚀 Tech Stack

-   **Frontend**: ReactJS
-   **Backend**: Flask-RESTful, MongoDB

## 📦 Libraries Used

-   **Backend**:
    
    -   `flask-restful`: RESTful API design for Flask applications.
    -   `flask-jwt-extended`: JWT-based authentication.
    -   `pymongo`: MongoDB operations.
    -   `dotenv`: Environment variable management.
-   **Frontend**:
    
    -   `grapesjs`: Drag-and-drop editor.
    -   `react-toastify`: User-friendly notifications.
    -   `axios`: HTTP client for API requests.
    -   `socket.io`: Real-time collaboration and updates.

## 📸 Screenshots

![image1](https://github.com/user-attachments/assets/762c4b0d-d1b9-41f8-82ed-86f1497bcc1e)
![image2](https://github.com/user-attachments/assets/3a1563cd-1de5-405e-86a9-d72c05e79365)
![image3](https://github.com/user-attachments/assets/75f944c1-8b39-416f-ad51-d8eef71e3b18)
![image4](https://github.com/user-attachments/assets/8f63e3fd-fab2-41a5-b382-bb091e275adc)
![image5](https://github.com/user-attachments/assets/72489e06-bc2d-4be7-b980-6bfaf62f85fb)
![image6](https://github.com/user-attachments/assets/a9a751d8-1e2d-484c-ab8e-cc78268712a7)
![image7](https://github.com/user-attachments/assets/6117891e-a7e7-4af3-b685-5d154a9bb76f)

## 📖 Getting Started

### Prerequisites

-   **Node.js** and **npm**
-   **Python** and **pip**
-   **MongoDB**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shauryasf/webweave.git
    cd webweave
    ```
    
2.  **Backend Setup**
    
    -   Navigate to the `backend` folder:
        ```bash
        cd backend
        ```
        
    -   Install dependencies:
		```bash
        pip install -r requirements.txt
        ```
        
    -   Create a `.env` file to store environment variables, such as your MongoDB connection string and JWT secret.
3.  **Frontend Setup**
    
    -   Navigate to the `frontend` folder:
        ```bash
        cd ../frontend
        ```
        
    -   Install npm dependencies:        
        ```bash
        npm install
        ```
        
4.  **Run the Application**
    
    -   Start the backend server:   
        ```bash
        cd ../backend
        flask run
        ```
        
    -   Start the frontend development server:
        ```bash
        cd ../frontend
        npm start
        ```
5. **Website is live at: localhost:5000**
