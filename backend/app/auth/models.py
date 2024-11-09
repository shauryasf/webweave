from ..extensions import mongo, bcrypt

class User:
    @staticmethod
    def create_user(email, password):
        """
        Creates a new user with the given email and password.

        Args:
            email (str): The email address of the user to be created.
            password (str): The password for the user to be created.

        Returns:
            tuple: A tuple containing a dictionary with a message or error and an HTTP status code.
                - If the email is already registered, returns ({"error": "Email already registered"}, 400).
                - If the user is created successfully, returns ({"message": "User created successfully"}, 201).
        """

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
        """
        Find a user by their email address.
        Args:
            email (str): The email address to search for.
        Returns:
            dict: A dictionary representing the user document if found, otherwise None.
        """

        return mongo.db.users.find_one({'email': email})
    
    @staticmethod
    def create_project(email, project_name, project_id, project_created_at, user):
        """
        Adds a new project to the user's list of created projects in the MongoDB database.
        Args:
            email (str): The email of the user creating the project.
            project_name (str): The name of the project being created.
            project_id (str): The unique identifier for the project.
            project_created_at (datetime): The timestamp when the project was created.
            user (str): The user who created the project.
        Returns:
            None
        """
        
        mongo.db.users.update_one(
            {"email": email},
            {"$push": {"createdProjects": {"data": {}, "name": project_name, "id": project_id, "createdAt": project_created_at, "createdBy": user}}}
        )

    