import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import Header from "../components/Header";
import ProjectModal from "../components/ProjectModal";
import UserManagementModal from "../components/UserManagementModal";

function DashboardPage(){
    const navigate = useNavigate()
    const [token, setToken] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showManageUserModal, setManageUserModal] = useState(false);

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
        const tempToken = window.localStorage.getItem("webweave-token");
        if (tempToken === null || tempToken === undefined || tempToken === ""){
            navigate("/");
            return;
        }
        axios.get("http://localhost:5000/project/verify_token", {headers: {Authorization: "Bearer " + tempToken}})
        .then(res => setToken(tempToken))
        .catch(err => navigate("/"))
    }, [])
    const [createdProjects, setCreatedProjects] = useState([])
    const [invitedProjects, setInvitedProjects] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const createdResponse = await axios.get('http://localhost:5000/project/projects?type=created', {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
                const invitedResponse = await axios.get('http://localhost:5000/project/projects?type=invited', {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
                setCreatedProjects(createdResponse.data.projects);
                setInvitedProjects(invitedResponse.data.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const handleManageUsers = (projectId) => {
        // Manage user logic or redirect
        navigate(`/project/${projectId}/manage-users`);
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`/api/project/projects/${projectId}`);
            setCreatedProjects((prev) => prev.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#024f3c_5%] to-[#141716_95%] text-white">
            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onCreate={handleCreateProject}
            />
            <Header />
            <div className="pt-8 pb-8 pl-16 pr-16 flex flex-col gap-4">
                <div className="flex flex-row w-100 align-center justify-between">
                    <h2 className="text-3xl font-bold mb-4">Your Projects</h2>
                    <button className="py-2 mt-4 rounded bg-green-500 hover:bg-green-600 transition duration-300 p-6" onClick={handleNewProjectClick}>
                        New Project
                    </button>
                </div>
                <section>
                    <h3 className="text-xl font-semibold mb-3">Created Projects</h3>
                    {createdProjects.length > 0 ? (
                        createdProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} isCreator={true} handleDeleteProject={handleDeleteProject} handleProjectClick={handleProjectClick} handleManageUsers={() => setManageUserModal(true)} />
                        ))
                    ) : (
                        <p>No projects created by you.</p>
                    )}
                </section>
                <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Invited Projects</h3>
                    {invitedProjects.length > 0 ? (
                        invitedProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} isCreator={false} handleDeleteProject={handleDeleteProject} handleProjectClick={handleProjectClick} handleManageUsers={() => setManageUserModal(true)} />
                        ))
                    ) : (
                        <p>No projects you are invited to.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default DashboardPage;

