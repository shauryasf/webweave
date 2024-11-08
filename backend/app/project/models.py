from ..extensions import mongo, bcrypt
import uuid
from .utils import getProjectMetadata, getInvitedProjectMetadata

class Project:
    @staticmethod
    def add_project(current_user, project_name, project_created_at):
        project_id = str(uuid.uuid4())
        mongo.db.users.update_one(
            {"email": current_user},
            {"$push": {"createdProjects": {"data": {}, "name": project_name, "id": project_id, "createdAt": project_created_at, "createdBy": current_user, "invitedUsers": [], "html": "" , "css": ""}}}
        )
        return project_id

    @staticmethod
    def update_project_data(current_user, project_id, new_data):
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
