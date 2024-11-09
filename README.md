
# WebWeave
<img src="https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/logo.png?token=GHSAT0AAAAAAC2HFXTJCZESRK7JAXAZALAAZZPTAXA" height="100" width="100">

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
![Image 1](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image1.png?token=GHSAT0AAAAAAC2HFXTJGI3WSQFDIJN4M4ZAZZPSYVA)
![Image 2](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image2.png?token=GHSAT0AAAAAAC2HFXTJHNFGELHETTMQRSPYZZPS6IQ)
![Image 3](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image3.png?token=GHSAT0AAAAAAC2HFXTILMZDD726S46ZWVFKZZPS6WA)
![Image 4](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image4.png?token=GHSAT0AAAAAAC2HFXTIAQZ6WITVMKJZVQ6IZZPS67A)
![Image 5](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image5.png?token=GHSAT0AAAAAAC2HFXTJRINRT4OZNR7OMFL4ZZPS7IQ)
![Image 6](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image6.png?token=GHSAT0AAAAAAC2HFXTIFCAFJIDART6UPRGIZZPS7RA)
![Image 7](https://raw.githubusercontent.com/shauryasf/webweave/refs/heads/main/images/image7.png?token=GHSAT0AAAAAAC2HFXTI4B24QPHIOHPKNXLGZZPS72A)

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
