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
    project_id = request.args.get('projectId')
    email = get_jwt_identity()
    if not project_id:
        return {"message": "Project ID is required"}, 400
    
    project_data = Project.get_project_data(email, project_id)

    return project_data


@project_bp.route('/verify_token', methods=['GET'])
@jwt_required()
def verify_token():
    return {"message": "Token is valid"}, 200

@project_bp.route('/projects', methods = ['GET'])
@jwt_required()
def get_projects():
    project_type = request.args.get('type')
    current_user_email = get_jwt_identity()

    if not project_type:
        return {"message": "Project type is required"}, 400
    
    projects = Project.get_projects(project_type, current_user_email)

    return projects

@project_bp.route('/invite', methods=['POST'])
def invite():
    data = request.json
    project_id = data.get('projectId')
    invite_email = data.get('inviteeEmail')
    owner_email = get_jwt_identity()

    result = Project.invite(project_id, invite_email, owner_email)

    return result

@project_bp.route('/project_invites', methods=['GET'])
@jwt_required()
def get_invited_projects():
    project_id = request.args.get('projectId')
    current_user_email = get_jwt_identity()

    if not project_id:
        return {"message": "Project ID is required"}, 400
    
    result = Project.get_invited_project(project_id, current_user_email)

    return result


@project_bp.route('/remove_invite', methods=['GET'])
@jwt_required()
def remove_invite():
    data = request.json
    project_id = data.get('projectId')
    invitee_email = data.get('inviteeEmail')
    owner_email = get_jwt_identity()
    if not project_id or not invitee_email:
        return {"message": "Project ID and invitee email are required."}, 400
    
    result = Project.remove_invite(project_id, invitee_email, owner_email)

    return result


