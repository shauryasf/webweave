from ..extensions import mongo, bcrypt

class User:
    @staticmethod
    def create_user(email, password):
        # Check if the email is already registered
        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return {"error": "Email already registered"}, 400

        # If the email is not registered, proceed to create the user
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        user_data = {
            'email': email,
            'password': hashed_pw,
            'createdProjects': [],
            'invitedProjects': []
        }
        mongo.db.users.insert_one(user_data)

        return {"message": "User created successfully"}, 201


    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})
    
    @staticmethod
    def create_project(email, project_name, project_id, project_created_at, user):
        mongo.db.users.update_one(
            {"email": email},
            {"$push": {"createdProjects": {"data": {}, "name": project_name, "id": project_id, "createdAt": project_created_at, "createdBy": user}}}
        )

    