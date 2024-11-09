import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ReactModal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ProjectModal = ({ isOpen, onClose, onCreate }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();

    const handleCreateProject = async () => {
        // if project name is empty or null, show error
        if (!projectName){
            toast.error("Project name can not be empty")
            return;
        }
        
        // try to post the new project to the backend
        try {
            const response = await axios.post(`${BASE_URL}/project/add_project`, {name: projectName, createdAt: (new Date().getTime())/1000}, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            const projectId = response.data.id;
            onCreate(); // Close modal
            navigate(`/project/${projectId}`); // Redirect to new project
        } catch (error) {
            if (error.response){
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content bg-gray-800 p-6 rounded-lg w-full max-w-sm text-white relative"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl">
                <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
            <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500 text-white"
                required
            />
            <button
                onClick={handleCreateProject}
                className="w-full py-2 mt-2 rounded bg-green-500 hover:bg-green-600 transition duration-300"
            >
                Create Project
            </button>
        </ReactModal>
    );
};

export default ProjectModal;
