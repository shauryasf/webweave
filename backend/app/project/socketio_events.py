"""
Module for handling Socket.IO events related to project collaboration.

This module defines event handlers for managing real-time interactions in project rooms.
It includes functionality for users to join project rooms and update project data collaboratively.
The event handlers ensure that only authorized users can access and modify project information.

Events:
    - 'join_project': Allows a user to join a project's Socket.IO room after verifying access permissions.
    - 'update_project': Enables collaborative updates to project data, HTML, and CSS content in real-time.

"""

from flask_socketio import emit, join_room
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import socketio, mongo

@socketio.on('join_project')
@jwt_required()
def join_project(data):
    """
    Handles a user joining a project room.
    This function retrieves the project ID from the provided data and the user's email from the JWT token.
    It then checks if the user is associated with the project either by creation or invitation.
    If the user is not associated with the project, an error message is emitted.
    If the user is associated, they join the project room and a message is emitted to the room.
    Args:
        data (dict): A dictionary containing the project ID with the key 'projectId'.
    Emits:
        'error': If the user is not associated with the project.
        'message': If the user successfully joins the project room.
    """

    project_id = data.get('projectId')
    email = get_jwt_identity()

    user = mongo.db.users.find_one(
        {"email": email, "$or": [
            {"createdProjects.id": project_id},
            {"invitedProjects.id": project_id}
        ]}
    )

    if not user:
        emit('error', {'message': 'Access denied'})
        return

    join_room(project_id)
    emit('message', {'message': f'{email} has joined the project room'}, room=project_id)

@socketio.on('update_project')
def update_project(data):
    """
    Update the project data for a given user.
    This function updates the project data for a user who either created the project or was invited to it.
    It first checks if the user is the creator of the project and updates the project data accordingly.
    If the user is not the creator, it checks if the user is an invited collaborator and updates the project data
    for the owner of the project.
    Args:
        data (dict): A dictionary containing the project update information.
            - projectId (str): The ID of the project to be updated.
            - data (dict): The updated project data.
            - userEmail (str): The email of the user requesting the update.
            - html (str, optional): The updated HTML content of the project.
            - css (str, optional): The updated CSS content of the project.
    Emits:
        'error': If the user does not have access to the project.
        'project_update': If the project is successfully updated, with the updated data, HTML, and CSS.
    Returns:
        None
    """

    project_id = data.get('projectId')
    updated_data = data.get('data')
    email = data.get("userEmail")

    user = mongo.db.users.find_one(
        {"email": email, "createdProjects.id": project_id},
        {"createdProjects": {"$elemMatch": {"id": project_id}}}
    )

    if user and "createdProjects" in user:
        mongo.db.users.update_one(
            {"email": email, "createdProjects.id": project_id},
            {"$set": {"createdProjects.$.data": updated_data, "createdProjects.$.html": data.get("html"), "createdProjects.$.css": data.get("css")}}
        )
    else:
        invited_user = mongo.db.users.find_one(
            {"email": email, "invitedProjects.id": project_id},
            {"invitedProjects": {"$elemMatch": {"id": project_id}}}
        )

        if not invited_user or "invitedProjects" not in invited_user:
            emit('error', {'message': 'Access denied'})
            return

        owner_email = invited_user["invitedProjects"][0]["owner"]

        mongo.db.users.update_one(
            {"email": owner_email, "createdProjects.id": project_id},
            {"$set": {"createdProjects.$.data": updated_data, 'html': data.get('html'), 'css': data.get('css')}}
        )

    emit('project_update', {'data': updated_data, 'html': data.get('html'), 'css': data.get('css')}, room=project_id)
