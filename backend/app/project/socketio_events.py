from flask_socketio import emit, join_room
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import socketio, mongo

@socketio.on('join_project')
@jwt_required()
def join_project(data):
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
            {"$set": {"createdProjects.$.data": updated_data}}
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
            {"$set": {"createdProjects.$.data": updated_data}}
        )

    emit('project_update', {'data': updated_data, 'html': data.get('html'), 'css': data.get('css')}, room=project_id)
