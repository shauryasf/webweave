from ..extensions import mongo

def getProjectMetadata(project):
    return {"name": project["name"], "id": project["id"], "createdBy": project["createdBy"], "createdAt": project["createdAt"], "invitedUsers": project["invitedUsers"]}

def getInvitedProjectMetadata(invited_project):
    project_id = invited_project['id']
    owner_email = invited_project['owner']

    # Find the owner's document and the specific project metadata
    owner = mongo.db.users.find_one(
        {"email": owner_email, "createdProjects.id": project_id},
        {"createdProjects.$": 1, "_id": 0}
    )

    # If the project exists in the owner's document, extract the metadata
    if owner and 'createdProjects' in owner:
        project = owner['createdProjects'][0]
        return {
            "id": project['id'],
            "name": project['name'],
            "createdBy": owner_email,
            "createdAt": project['createdAt']
        }

    # Return None if the project wasn't found
    return None