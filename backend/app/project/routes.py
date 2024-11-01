import email
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from ..auth.models import User
from ..extensions import mongo


project_bp = Blueprint('project', __name__)

def get_project_metadata(project):
    return {"name": project["name"], "id": project["id"], "createdBy": project["createdBy"], "createdAt": project["createdAt"]}


@project_bp.route('/add_project', methods=['POST'])
@jwt_required()
def add_project():
    email = get_jwt_identity()
    project_name = request.json.get('name')
    project_id = str(uuid.uuid4())
    project_created_at = request.json.get('createdAt')

    if not email or not project_id or not project_data:
        return {"message": "Email, project ID, and project data are required."}, 400
    
    user = get_jwt_identity()
    if not user:
        return {"message": "User not found."}, 404
    
    User.create_project(email, project_name, project_id, project_created_at, user)

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

    result = mongo.db.users.update_one(
        {"email": current_user, "createdProjects.id": project_id},
        {"$set": {"createdProjects.$.data": new_data}}
    )

    if result.matched_count == 0:
        result = mongo.db.users.update_one(
            {"email": current_user, "invitedProjects.id": project_id},
            {"$set": {"invitedProjects.$.data": new_data}}
        )
        if result.matched_count == 0:
            return {"message": "Project not found."}, 404

    return {"message": "Project updated successfully."}, 200

@project_bp.route('/get_project_data', methods=['GET'])
@jwt_required()
def get_project_data():
    project_id = request.args.get('projectId')
    email = get_jwt_identity()

    if not project_id:
        return {"message": "Project ID is required"}, 400

    result = mongo.db.users.find_one(
        {"email": email, "createdProjects.id": project_id},
        {"createdProjects": {"$elemMatch": {"id": project_id}}}
    )

    if result and "createdProjects" in result:
        project_data = result["createdProjects"][0]
        return {"data": project_data["data"]}, 200

    result = mongo.db.users.find_one(
        {"email": email, "invitedProjects.id": project_id},
        {"invitedProjects": {"$elemMatch": {"id": project_id}}}
    )

    if result and "invitedProjects" in result:
        project_data = result["invitedProjects"][0]
        return {"data": project_data["data"]}, 200

    return {"message": "Project not found."}, 404

@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    project_type = request.args.get('type')
    email = get_jwt_identity()

    user = User.find_by_email(email)

    if not user:
        return {"message": "User not found."}, 404

    if project_type == 'created':
        projects = list(map(get_project_metadata, user.get('createdProjects', [])))
    elif project_type == 'invited':
        projects = list(map(get_project_metadata, user.get('invitedProjects', [])))
    else:
        return {"message": "Invalid project type."}, 400
    
    return {"projects": projects}, 200

@project_bp.route('/verify_token', methods=['GET'])
@jwt_required()
def verify_token():
    return {"message": "Token is valid"}, 200
    

