import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserManagementModal = ({ projectId, onClose }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    // invitedUsers keep track of all the invited users
    const [invitedUsers, setInvitedUsers] = useState([]);
    // new user's email that is to be invited
    const [newUserEmail, setNewUserEmail] = useState("");

    // on load, fetch all the invited users for the current project
    useEffect(() => {
        fetchInvitedUsers();
    }, []);

    const fetchInvitedUsers = async () => {
        // try to fetch the invited users by the projectId
        try {
            const response = await axios.get(`${BASE_URL}/project/project_invites?projectId=${projectId}`, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            setInvitedUsers(response.data.invitedUsers);
        } catch (error) {
            if (error.response){
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
        }
    };

    const handleAddUser = async () => {
        // if email is not empty
        // try to add the email to the invitedUsers 
        // if success add it on view too
        // else show error
        if (newUserEmail) {
            try {
                await axios.post(`${BASE_URL}/project/invite`, { projectId, inviteeEmail: newUserEmail }, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
                setInvitedUsers([...invitedUsers, newUserEmail]);
                setNewUserEmail("");
                toast.success("User added successfully")
            } catch (error) {
                if (error.response){
                    toast.error(error.response.data.message)
                } else {
                    toast.error(error.message)
                }
            }
        } else {
            toast.error("Email can not be empty")
        }
    };

    const handleRemoveUser = async (email) => {
        // try to remove the person from the invitedUsers
        // if not success, show toast error
        try {
            await axios.post(`${BASE_URL}/project/remove_invite`, { projectId, inviteeEmail: email }, {headers: {Authorization: "Bearer " + window.localStorage.getItem("webweave-token")}});
            setInvitedUsers(invitedUsers.filter(user => user !== email));
            toast.success("User removed successfully")
        } catch (error) {
            if (error.response){
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message)
            }
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
