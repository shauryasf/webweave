import { FaUser, FaTrash, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';
import UserManagementModal from './UserManagementModal';

const ProjectCard = ({ project, isCreator, handleProjectClick, handleManageUsers, handleDeleteProject }) => {
    const [manageUserModal, setManageUserModal] = useState(false);
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
        </>
    )
};

export default ProjectCard;