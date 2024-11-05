import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const UserManagementModal = ({ projectId, onClose }) => {
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState("");

    useEffect(() => {
        fetchInvitedUsers();
    }, []);

    const fetchInvitedUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/project/project_invites?projectId=${projectId}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            setInvitedUsers(response.data.invitedUsers);
        } catch (error) {
            console.error("Error fetching invited users", error);
        }
    };

    const handleAddUser = async () => {
        if (newUserEmail) {
            try {
                await axios.post('http://localhost:5000/project/invite', { projectId, inviteeEmail: newUserEmail }, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
                setInvitedUsers([...invitedUsers, newUserEmail]);
                setNewUserEmail("");
            } catch (error) {
                console.error("Error inviting user", error);
            }
        }
    };

    const handleRemoveUser = async (email) => {
        try {
            await axios.post('http://localhost:5000/project/remove_invite', { projectId, inviteeEmail: email }, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            setInvitedUsers(invitedUsers.filter(user => user !== email));
        } catch (error) {
            console.error("Error removing user", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl mb-4">Manage Users</h2>
                <div className="mb-4">
                    <h3 className="text-gray-400 text-lg mb-2">Invited Users</h3>
                    <ul>
                        {invitedUsers.map((email) => (
                            <li key={email} className="flex justify-between items-center text-gray-300 py-1">
                                <span>{email}</span>
                                <button
                                    onClick={() => handleRemoveUser(email)}
                                    className="text-red-400 hover:text-red-500 text-lg"
                                    title="Remove User"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-4">
                    <h3 className="text-gray-400 text-lg mb-2">Invite New User</h3>
                    <div className="flex">
                        <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="flex-1 p-2 bg-gray-800 text-white rounded-l"
                            placeholder="Enter email"
                        />
                        <button
                            onClick={handleAddUser}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r"
                        >
                            Invite
                        </button>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-gray-400 hover:text-white"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserManagementModal;
