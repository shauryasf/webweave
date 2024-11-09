from ..extensions import mongo

def getProjectMetadata(project):
    """
    Extract metadata from a project dictionary.

    Args:
        project (dict): The project data containing details like name, id, creator, etc.

    Returns:
        dict: A dictionary containing the project's metadata, including:
            - name (str): The name of the project.
            - id (str): The unique identifier of the project.
            - createdBy (str): The email of the user who created the project.
            - createdAt (datetime): The timestamp when the project was created.
            - invitedUsers (list): A list of users invited to the project.
    """
    return {"name": project["name"], "id": project["id"], "createdBy": project["createdBy"], "createdAt": project["createdAt"], "invitedUsers": project["invitedUsers"]}

def getInvitedProjectMetadata(invited_project):
    """
    Retrieve metadata for an invited project from the database.

    Args:
        invited_project (dict): A dictionary containing the 'id' of the project and the 'owner's email.

    Returns:
        dict or None: A dictionary with the project's metadata if found, including:
            - id (str): The unique identifier of the project.
            - name (str): The name of the project.
            - createdBy (str): The email of the user who created the project.
            - createdAt (datetime): The timestamp when the project was created.
        Returns None if the project wasn't found.
    """
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