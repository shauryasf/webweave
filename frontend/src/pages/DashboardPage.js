import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import DashboardHeader from "../components/DashboardHeader";
import ProjectModal from "../components/ProjectModal";
import UserManagementModal from "../components/UserManagementModal";
import { InfinitySpin } from 'react-loader-spinner';
import { toast } from "react-toastify";

function DashboardPage() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showManageUserModal, setManageUserModal] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state for the spinner
    const [createdProjects, setCreatedProjects] = useState([]);
    const [invitedProjects, setInvitedProjects] = useState([]);

    const handleNewProjectClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateProject = () => {
        setIsModalOpen(false); // Close the modal after project creation
    };

    useEffect(() => {
        // verify the token, if it is invalid, redirect the user to /auth
        const tempToken = window.localStorage.getItem("webweave-token");
        if (!tempToken) {
            navigate("/auth");
            return;
        }
        axios.get(`${BASE_URL}/project/verify_token`, { headers: { Authorization: "Bearer " + tempToken } })
            .then(res => setToken(tempToken))
            .catch(err => navigate("/auth"));
    }, []);

    useEffect(() => {
        // get the created and invited projects of the user
        const fetchProjects = async () => {
            try {
                setLoading(true); // Show loading spinner
                const createdResponse = await axios.get(`${BASE_URL}/project/projects?type=created`, { headers: { Authorization: "Bearer " + window.localStorage.getItem("webweave-token") } });
                const invitedResponse = await axios.get(`${BASE_URL}/project/projects?type=invited`, { headers: { Authorization: "Bearer " + window.localStorage.getItem("webweave-token") } });
                setCreatedProjects(createdResponse.data.projects);
                setInvitedProjects(invitedResponse.data.projects);
            } catch (error) {
                if (error.response){
                    toast.error(error.response.data.message)
                } else {
                    toast.error(error.message)
                }
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };
        fetchProjects();
    }, []);

    // navigate to the project route
    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };


    const handleDeleteProject = async (projectId) => {
        // try to delete the project by sending request to the backend with the project id and token
        try {
            await axios.delete(`${BASE_URL}/project/projects?projectId=${projectId}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            setCreatedProjects((prev) => prev.filter((project) => project.id !== projectId));
            toast.success("Project deleted successfully")
        } catch (error) {
            if (error.response){
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
    };
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#024f3c_5%] to-[#141716_95%] text-white">
            {/* Create new project modal */}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onCreate={handleCreateProject}
            />
            <DashboardHeader />
            <div className="pt-8 pb-8 pl-16 pr-16 flex flex-col gap-4">
                <div className="flex flex-row w-100 align-center justify-between">
                    <h2 className="text-3xl font-bold mb-4">Your Projects</h2>
                    <button className="py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300 p-6" onClick={handleNewProjectClick}>
                        New Project
                    </button>
                </div>

                {loading ? (
                    // Show loading spinner while fetching data
                    <div className="flex justify-center items-center h-[80vh]">
                        <InfinitySpin width="200" color="#4fa94d" />
                    </div>
                ) : (
                    <>
                        {/* Show created and invited projects */}
                        <section>
                            <h3 className="text-xl font-semibold mb-3">Created Projects</h3>
                            {createdProjects.length > 0 ? (
                                createdProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        isCreator={true}
                                        handleDeleteProject={handleDeleteProject}
                                        handleProjectClick={handleProjectClick}
                                        handleManageUsers={() => setManageUserModal(true)}
                                    />
                                ))
                            ) : (
                                <p>No projects created by you.</p>
                            )}
                        </section>
                        <section className="mt-6">
                            <h3 className="text-xl font-semibold mb-3">Invited Projects</h3>
                            {invitedProjects.length > 0 ? (
                                invitedProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        isCreator={false}
                                        handleDeleteProject={handleDeleteProject}
                                        handleProjectClick={handleProjectClick}
                                        handleManageUsers={() => setManageUserModal(true)}
                                    />
                                ))
                            ) : (
                                <p>No projects you are invited to.</p>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
