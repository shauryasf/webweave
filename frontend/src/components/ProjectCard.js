import { FaUser, FaTrash, FaUsers, FaArrowRight, FaSleigh } from 'react-icons/fa';
import { HiRocketLaunch } from "react-icons/hi2";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagementModal from './UserManagementModal';
import CustomModal from './CustomModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProjectCard = ({ project, isCreator, handleProjectClick, handleManageUsers, handleDeleteProject }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const [manageUserModal, setManageUserModal] = useState(false); // toggle modal open and close
    const [isModalOpen, setModalOpen] = useState(false); // status to check if the modal is open or not
    const navigate = useNavigate();
    const [vercelToken, setVercelToken] = useState(null); // Store the Vercel token
    const [deploymentName, setDeploymentName] = useState(''); // Deployment name input
    const [isDeploying, setIsDeploying] = useState(false); // Track deployment state
    const [deployedUrl, setDeployedUrl] = useState(null)

    const openInNewTab = (url) => {
        // Check if URL starts with "http://" or "https://"; if not, add "https://"
        const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        const newWindow = window.open(validUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };
    

    const handleButtonClick = () => {
        // if token exists, set the token
        const token = window.localStorage.getItem('webweave-vercel-token');
        if (token) {
            setVercelToken(token);
        }
        // open the modal
        setModalOpen(true);
    };

    // Function to handle login with Vercel
    const handleLoginWithVercel = () => {
        // Redirect to Vercel integration URL
        window.location.replace(process.env.REACT_APP_INTERACTION_URL);
    };

    // Handle deployment creation
    const handleCreateDeployment = async () => {
        if (!deploymentName){
            toast.error("Enter a deployment name")
            return;
        }
        // set loading to true
        setIsDeploying(true);
        try {
            // get the html and css data from the backend to send to the vercel api
            const dataResponse = await axios.get(`${BASE_URL}/project/project_data?projectId=${project.id}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}})
            var htmlContent = dataResponse.data.html;
            htmlContent += "\n<link rel='stylesheet' href='styles.css'>"
            const cssContent = dataResponse.data.css;
            // post the html and css files to the vercel api along with the deployment name
            const response = await axios.post(
                'https://api.vercel.com/v13/deployments',
                {
                name: deploymentName,
                target: 'production',
                files: [
                    {
                            "data": htmlContent,
                            "encoding": "utf-8",
                            "file": "build/index.html"
                    },
                    {
                            "data": cssContent,
                            "encoding": "utf-8",
                            "file": "build/styles.css"
                    }
                ],
                projectSettings: {
                    "buildCommand": null,
                    "devCommand": null,
                    "framework": null,
                    "commandForIgnoringBuildStep": "",
                    "installCommand": null,
                    "outputDirectory": null,
                    "rootDirectory": "build",
                    "serverlessFunctionRegion": null,
                    "sourceFilesOutsideRootDirectory": false,
                },
                },
                {
                headers: {
                    Authorization: `Bearer ${vercelToken}`,
                    'Content-Type': 'application/json'
                }
                }
            );
            // if success, set the deployed url for the user to view
            setDeployedUrl(response.data.alias[0])
            toast.success("Deployment successful")
            setDeploymentName("")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-800 transition duration-300 mb-3">
                <div className="flex items-center gap-10 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                    <div className="text-green-500 text-xl font-bold">{project.name}</div>
                    <div className="text-gray-500 text-sm">• Created by <span className="text-white">{project.createdBy}</span></div>
                    <div className="text-gray-500 text-sm">• Created on {new Date(project.createdAt * 1000).toDateString()}</div>
                </div>
                <div className="flex items-center gap-6">
                    {isCreator && (
                        <>
                            <button
                                onClick={() => setManageUserModal(true)}
                                className="text-white hover:text-blue-400 text-xl"
                                title="Manage Users"
                            >
                                <FaUsers/>
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-white hover:text-red-400 text-xl"
                                title="Delete Project"
                            >
                                <FaTrash />
                            </button>
                            <button onClick={handleButtonClick} className="text-white hover:text-green-400 text-xl" title="Deploy">
                                <HiRocketLaunch />
                            </button>
                        </>
                    )}
                    <button onClick={() => handleProjectClick(project.id)} className="text-white hover:text-green-400 text-xl" title="Open Project">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            {manageUserModal && (
                <UserManagementModal projectId={project.id} onClose={() => setManageUserModal(false)} />
            )}
            {/* Modal for Vercel Login */}
            {isModalOpen && (
                <CustomModal
                open={isModalOpen}
                title={!vercelToken ? "Login with Vercel" : "Deploy your project"}
                close={() => setModalOpen(false)}
                >
                <div className="text-center">
                    {!vercelToken ? (
                    <>
                        <p>You need to log in with Vercel to publish your site.</p>
                        <button
                        onClick={handleLoginWithVercel}
                        className="w-[300px] py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300"
                        >
                        Login with Vercel
                        </button>
                    </>
                    ) : (
                        <div className="flex flex-col items-start">
                        <p className="mt-5 text-lg font-normal">Enter deployment details:</p>
                        <input
                          type="text"
                          placeholder="Enter deployment name"
                          value={deploymentName}
                          onChange={(e) => setDeploymentName(e.target.value)}
                          className="border rounded p-2 w-[80%] mt-3 text-black"
                        />
                        <button
                          onClick={handleCreateDeployment}
                          className="py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300 p-6"
                          disabled={isDeploying}
                        >
                          {isDeploying ? 'Deploying...' : 'Create Deployment'}
                        </button>
                        {
                            deployedUrl !== null ? 
                            <p className="mt-[30px] text-xl">🚀 Your website is live now at <span onClick={() => openInNewTab(deployedUrl)} className='text-green-600 font-semibold cursor-pointer'>{deployedUrl}</span> </p>
                            : ""
                        }
                      </div>
                    )}
                </div>
            </CustomModal>)}
        </>
    )
};

export default ProjectCard;
