import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from dotenv import load_dotenv
from bson.objectid import ObjectId
import uuid

# Load environment variables
load_dotenv()

# 1. Initialize App and Extensions
app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") # For JWT
CORS(app)
bcrypt = Bcrypt(app)
mongo = PyMongo(app)

# Reference to the 'users' collection in MongoDB
users_collection = mongo.db.users

# 2. Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                 return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# 3. API Routes

# --- AUTHENTICATION ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({"username": username, "password_hash": hashed_password, "todos": []})
    return jsonify({"message": f"User '{username}' created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({"username": username})

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})
    
    return jsonify({'error': 'Invalid username or password'}), 401

# --- PROTECTED TODO ROUTES ---
@app.route('/api/todos', methods=['GET'])
@token_required
def get_todos(current_user):
    # The user's todos are already in the user document
    return jsonify(current_user.get('todos', []))

@app.route('/api/todos', methods=['POST'])
@token_required
def add_todo(current_user):
    data = request.get_json()
    new_todo = {
        "todo_id": str(uuid.uuid4()),
        "content": data['content'],
        "is_completed": False
    }
    users_collection.update_one(
        {'_id': current_user['_id']},
        {'$push': {'todos': new_todo}}
    )
    return jsonify(new_todo), 201

@app.route('/api/todos/<string:todo_id>', methods=['PUT'])
@token_required
def update_todo(current_user, todo_id):
    data = request.get_json()
    new_status = data.get('is_completed')

    # Find the specific todo in the array and update its 'is_completed' status
    result = users_collection.update_one(
        {'_id': current_user['_id'], 'todos.todo_id': todo_id},
        {'$set': {'todos.$.is_completed': new_status}}
    )
    if result.matched_count == 0:
        return jsonify({'error': 'Todo not found'}), 404
    
    # Find and return the updated todo document
    user = users_collection.find_one({'_id': current_user['_id']})
    updated_todo = next((t for t in user['todos'] if t['todo_id'] == todo_id), None)
    return jsonify(updated_todo)

@app.route('/api/todos/<string:todo_id>', methods=['DELETE'])
@token_required
def delete_todo(current_user, todo_id):
    # Pull (remove) the todo from the todos array that matches the todo_id
    result = users_collection.update_one(
        {'_id': current_user['_id']},
        {'$pull': {'todos': {'todo_id': todo_id}}}
    )
    if result.matched_count == 0:
        return jsonify({'error': 'Todo not found'}), 404
        
    return '', 204

# 4. Main execution block
if __name__ == '__main__':
    app.run(debug=True, port=5000)