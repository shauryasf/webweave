from ..extensions import mongo, bcrypt
import uuid
from .utils import getProjectMetadata, getInvitedProjectMetadata

class Project:
    @staticmethod
    def add_project(current_user, project_name, project_created_at):
        """
        Adds a new project to the current user's list of created projects in the MongoDB database.
        Args:
            current_user (str): The email of the current user.
            project_name (str): The name of the project to be added.
            project_created_at (str): The timestamp when the project was created.
        Returns:
            str: The unique identifier (UUID) of the newly created project.
        """

        project_id = str(uuid.uuid4())
        mongo.db.users.update_one(
            {"email": current_user},
            {"$push": {"createdProjects": {"data": {}, "name": project_name, "id": project_id, "createdAt": project_created_at, "createdBy": current_user, "invitedUsers": [], "html": "" , "css": ""}}}
        )
        return project_id

    @staticmethod
    def update_project_data(current_user, project_id, new_data):
        """
        Update the data of a project for the current user.
        This function updates the data of a project that the current user has created or has been invited to. 
        If the project is found in the user's created projects, it updates the data directly. 
        If the project is found in the user's invited projects, it updates the data in the owner's created projects.
        Args:
            current_user (str): The email of the current user.
            project_id (str): The ID of the project to be updated.
            new_data (dict): The new data to update the project with.
        Returns:
            tuple: A tuple containing a message and an HTTP status code.
                - If the project is updated successfully, returns ({"message": "Project updated successfully"}, 200).
                - If the project is not found or access is denied, returns ({"message": "Project not found or access denied."}, 404).
                - If the project data update fails, returns ({"message": "Failed to update project data."}, 500).
        """

        result = mongo.db.users.update_one(
            {"email": current_user, "createdProjects.id": project_id},
            {"$set": {"createdProjects.$.data": new_data}}
        )

        if result.matched_count == 0:
            invited_project = mongo.db.users.find_one(
                {"email": current_user, "invitedProjects.id": project_id},
                {"invitedProjects.$": 1}
            )

            if not invited_project:
                return {"message": "Project not found or access denied."}, 404

            owner_email = invited_project['invitedProjects'][0]['owner']
            result = mongo.db.users.update_one(
                {"email": owner_email, "createdProjects.id": project_id},
                {"$set": {"createdProjects.$.data": new_data}}
            )

            if result.matched_count == 0:
                return {"message": "Failed to update project data."}, 500
            
        return {"message": "Project updated successfully"}, 200

    @staticmethod
    def get_project_data(email, project_id):
        """
        Retrieve project data for a given user and project ID.
        This function searches for a project within the user's created projects or invited projects.
        If the project is found, it returns the project data including HTML and CSS content.
        Args:
            email (str): The email address of the user.
            project_id (str): The unique identifier of the project.
        Returns:
            tuple: A tuple containing a dictionary with project data and an HTTP status code.
                - If the project is found in the user's created projects, the dictionary contains:
                    - "data": The project data.
                    - "html": The HTML content of the project.
                    - "css": The CSS content of the project.
                - If the project is found in the user's invited projects, the dictionary contains:
                    - "data": The project data.
                    - "html": The HTML content of the project.
                    - "css": The CSS content of the project.
                - If the project is not found, the dictionary contains:
                    - "message": A message indicating that no project was found with the given ID.
        Raises:
            None
        Example:
            >>> get_project_data("user@example.com", "project123")
            ({"data": "...", "html": "...", "css": "..."}, 200)
        """

        result = mongo.db.users.find_one(
            {"email": email, "createdProjects.id": project_id},
            {"createdProjects": {"$elemMatch": {"id": project_id}}}
        )

        if result and "createdProjects" in result:
            project_data = result["createdProjects"][0]
            return {"data": project_data["data"], "html": project_data["html"], "css": project_data["css"]}, 200

        result = mongo.db.users.find_one(
            {"email": email, "invitedProjects.id": project_id},
            {"invitedProjects": {"$elemMatch": {"id": project_id}}}
        )

        if result and "invitedProjects" in result:
            owner_email = result["invitedProjects"][0]["owner"]
            owner_result = mongo.db.users.find_one(
                {"email": owner_email, "createdProjects.id": project_id},
                {"createdProjects.$": 1}
            )

            if owner_result and "createdProjects" in owner_result:
                project_data = owner_result["createdProjects"][0]
                return {"data": project_data["data"], "html": project_data["html"], "css": project_data["css"]}, 200

        return {"message": "No project found with given ID"}, 404

    @staticmethod
    def get_projects(project_type, current_user_email):
        """
        Retrieve projects based on the project type for the given user.
        Args:
            project_type (str): The type of projects to retrieve. Can be 'created' or 'invited'.
            current_user_email (str): The email of the current user.
        Returns:
            tuple: A tuple containing a dictionary with the projects or an error message, and an HTTP status code.
                - If successful, returns a dictionary with a key 'projects' containing a list of project metadata and a status code 200.
                - If the user is not found, returns a dictionary with a key 'message' containing "User not found" and a status code 404.
                - If the project type is invalid, returns a dictionary with a key 'message' containing "Invalid project type" and a status code 400.
        """

        user = mongo.db.users.find_one({"email": current_user_email}, {"createdProjects": 1, "invitedProjects": 1})
        if not user:
            return {"message": "User not found"}, 404
        if project_type == 'created':
            projects = list(map(getProjectMetadata, user.get('createdProjects', [])))
        elif project_type == 'invited':
            projects = list(map(getInvitedProjectMetadata, user.get('invitedProjects', [])))
        else:
            return {"message": "Invalid project type"}, 400
        return {"projects": projects}, 200

    @staticmethod
    def delete_project(email, project_id):
        """
        Deletes a project from the database if the current user is the owner.
        Args:
            email (str): The email of the user attempting to delete the project.
            project_id (str): The ID of the project to be deleted.
        Returns:
            tuple: A tuple containing a dictionary with a message and an HTTP status code.
                - If the project is successfully deleted, returns ({"message": "Project deleted successfully."}, 200).
                - If the project is not found or the user does not have access, returns ({"message": "Project not found or access denied."}, 404).
        """

        # Attempt to delete the project only if the current user is the owner
        result = mongo.db.users.update_one(
            {"email": email, "createdProjects.id": project_id},
            {"$pull": {"createdProjects": {"id": project_id}}}
        )

        if result.modified_count == 0:
            return {"message": "Project not found or access denied."}, 404

        # Also remove the project from any invited users' `invitedProjects` list
        mongo.db.users.update_many(
            {"invitedProjects.id": project_id},
            {"$pull": {"invitedProjects": {"id": project_id}}}
        )

        return {"message": "Project deleted successfully."}, 200
        
    @staticmethod
    def invite(project_id, invitee_email, owner_email):
        # Check if the invitee email is registered
        invitee = mongo.db.users.find_one({"email": invitee_email})
        if not invitee:
            return {"message": "User does not exist"}, 404
        project = mongo.db.users.find_one(
            {"email": owner_email, "createdProjects.id": project_id},
            {"createdProjects": {"$elemMatch": {"id": project_id}}}
        )

        if not project:
            return {"message": "Only the project owner can invite users"}, 403

        mongo.db.users.update_one(
            {"email": owner_email, "createdProjects.id": project_id},
            {"$addToSet": {"createdProjects.$.invitedUsers": invitee_email}}
        )

        mongo.db.users.update_one(
            {"email": invitee_email},
            {"$addToSet": {"invitedProjects": {"id": project_id, "owner": owner_email}}}
        )

        return {"message": "User invited successfully"}, 200
    
    @staticmethod
    def get_invited_project(project_id, current_user):
        project = mongo.db.users.find_one(
            {"email": current_user, "createdProjects.id": project_id},
            {"createdProjects.$": 1}
        )

        if not project:
            return {"message": "Project not found or you are not the owner"}, 403

        invited_users = project['createdProjects'][0].get('invitedUsers', [])
        return {"invitedUsers": invited_users}, 200
    
    @staticmethod
    def remove_invite(project_id, invitee_email, owner_email):
        project = mongo.db.users.find_one(
            {"email": owner_email, "createdProjects.id": project_id},
            {"_id": 0, "createdProjects.$": 1}
        )
        if not project:
            return {"message": "Project not found or access denied."}, 403

        mongo.db.users.update_one(
            {"email": invitee_email},
            {"$pull": {"invitedProjects": {"id": project_id}}}
        )

        mongo.db.users.update_one(
            {"email": owner_email, "createdProjects.id": project_id},
            {"$pull": {"createdProjects.$.invitedUsers": invitee_email}}
        )

        return {"message": "Invitee removed from the project successfully."}, 200
