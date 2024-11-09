import email
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from .models import Project
from ..extensions import mongo
from .utils import getProjectMetadata, getInvitedProjectMetadata


project_bp = Blueprint('project', __name__)

@project_bp.route('/add_project', methods=['POST'])
@jwt_required()
def add_project():
    """
    Adds a new project using the provided JSON data from the request.
    The JSON data should contain:
    - 'name': The name of the project.
    - 'createdAt': The creation date of the project.
    The function also retrieves the current user identity from the JWT token.
    Returns:
        A JSON response with a success message and the project ID if the project is added successfully.
        A JSON response with an error message if the required information is not provided.
    """

    data = request.json
    project_name = data.get('name')
    project_created_at = data.get('createdAt')
    current_user = get_jwt_identity()
    if not project_name or not project_created_at:
        return {"message": "Not enough information."}, 400
    
    project_id = Project.add_project(current_user, project_name, project_created_at)

    return {"message": "Project added successfully.", "id": project_id}, 201



@project_bp.route('/project_data', methods=['POST'])
@jwt_required()
def project_data():
    """Handles updating project data.
    This function retrieves JSON data from the request, extracts the project ID and new data, and obtains the current user identity.
    It validates the presence of required fields and updates the project data accordingly.
    Returns:
        tuple: A tuple containing a JSON response message and an HTTP status code.
    """

    data = request.json
    project_id = data.get('projectId')
    new_data = data.get('data')
    current_user = get_jwt_identity()

    if not project_id or new_data is None:
        return {"message": "Project ID and new data are required."}, 400

    result = Project.update_project_data(current_user, project_id, new_data)

    return result

@project_bp.route('/project_data', methods=['GET'])
@jwt_required()
def get_project_data():
    """
    Retrieve project data based on the provided project ID and user email.
    This function extracts the project ID from the request arguments and the
    user's email from the JWT token. It then fetches the project data using
    these parameters.
    Returns:
        dict: A dictionary containing the project data if the project ID is valid.
        tuple: A tuple containing an error message and a status code if the project ID is missing.
    Raises:
        None
    """

    project_id = request.args.get('projectId')
    email = get_jwt_identity()
    if not project_id:
        return {"message": "Project ID is required"}, 400
    
    project_data = Project.get_project_data(email, project_id)

    return project_data


@project_bp.route('/verify_token', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Verify the validity of a token.
    Returns:
        tuple: A dictionary with a message indicating the token is valid and an HTTP status code 200.
    """

    return {"message": "Token is valid"}, 200

@project_bp.route('/projects', methods = ['GET'])
@jwt_required()
def get_projects():
    """
    Retrieve projects based on the project type and the current user's email.
    This function extracts the project type from the request arguments and the current user's email
    from the JWT token. It then fetches the projects that match the given project type and belong
    to the current user.
    Returns:
        dict: A dictionary containing the projects if successful.
        tuple: A tuple containing an error message and an HTTP status code if the project type is not provided.
    Raises:
        None
    """

    project_type = request.args.get('type')
    current_user_email = get_jwt_identity()

    if not project_type:
        return {"message": "Project type is required"}, 400
    
    projects = Project.get_projects(project_type, current_user_email)

    return projects

@project_bp.route('/projects', methods=['DELETE'])
@jwt_required()
def delete_project():
    """
    Deletes a project based on the provided project ID and the email of the user.
    This function retrieves the email of the user from the JWT token and the project ID from the request arguments.
    It then calls the delete_project method of the Project class to delete the project.
    Returns:
        status (str): The status of the deletion operation.
    """

    email = get_jwt_identity()
    project_id = request.args.get('projectId')
    status = Project.delete_project(email, project_id)
    return status

@project_bp.route('/invite', methods=['POST'])
@jwt_required()
def invite():
    """
    Handles the invitation of a user to a project.
    This function retrieves the project ID and the invitee's email from the request's JSON payload.
    It also gets the owner's email from the JWT identity. Then, it calls the `Project.invite` method
    to process the invitation.
    Returns:
        The result of the `Project.invite` method, which could be a success message or an error message.
    """

    data = request.json
    project_id = data.get('projectId')
    invite_email = data.get('inviteeEmail')
    owner_email = get_jwt_identity()

    result = Project.invite(project_id, invite_email, owner_email)

    return result

@project_bp.route('/project_invites', methods=['GET'])
@jwt_required()
def get_invited_projects():
    """
    Retrieve the invited project details for the current user.
    This function extracts the project ID from the request arguments and the current user's email
    from the JWT token. It then fetches the project details for which the user is invited.
    Returns:
        dict: A dictionary containing the project details if the user is invited.
        tuple: A tuple containing an error message and a status code if the project ID is not provided.
    Raises:
        Exception: If there is an issue with fetching the project details.
    """

    project_id = request.args.get('projectId')
    current_user_email = get_jwt_identity()

    if not project_id:
        return {"message": "Project ID is required"}, 400
    
    result = Project.get_invited_project(project_id, current_user_email)

    return result


@project_bp.route('/remove_invite', methods=['POST'])
@jwt_required()
def remove_invite():
    """
    Remove an invitee from a project.
    This function removes an invitee from a project based on the provided project ID and invitee email.
    The owner's email is retrieved from the JWT identity.
    Returns:
        dict: A message indicating the result of the operation.
        int: The HTTP status code.
    Request JSON:
        projectId (str): The ID of the project.
        inviteeEmail (str): The email of the invitee to be removed.
    Responses:
        200: If the invitee was successfully removed.
        400: If the project ID or invitee email is missing.
    """

    data = request.json
    project_id = data.get('projectId')
    invitee_email = data.get('inviteeEmail')
    owner_email = get_jwt_identity()
    if not project_id or not invitee_email:
        return {"message": "Project ID and invitee email are required."}, 400
    
    result = Project.remove_invite(project_id, invitee_email, owner_email)

    return result


