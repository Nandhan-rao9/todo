# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid

# 1. Initialize App and CORS
app = Flask(__name__)
CORS(app)

# 2. Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 3. Define Database Model
class Todo(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.String(200), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "is_completed": self.is_completed
        }

# 4. API Routes using the Database

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Returns a list of all todo items from the database."""
    todos_from_db = Todo.query.all()
    # Convert the list of Todo objects to a list of dictionaries
    todos_as_dicts = [todo.to_dict() for todo in todos_from_db]
    return jsonify(todos_as_dicts)

# POST /api/todos - Create a new todo in the DB
@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Creates a new todo item and saves it to the database."""
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({"error": "Missing 'content' in request"}), 400

    # Create a new Todo object from the request data
    new_todo = Todo(content=data['content'])
    
    # Add to the session and commit to the database
    db.session.add(new_todo)
    db.session.commit()
    
    return jsonify(new_todo.to_dict()), 201

# PUT /api/todos/<id> - Update an existing todo in the DB
@app.route('/api/todos/<string:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Updates an existing todo item in the database."""
    todo_to_update = Todo.query.get(todo_id)
    if not todo_to_update:
        return jsonify({"error": "Todo not found"}), 404

    data = request.get_json()
    # Update the object's attributes if new values are provided
    if 'content' in data:
        todo_to_update.content = data['content']
    if 'is_completed' in data:
        todo_to_update.is_completed = data['is_completed']
        
    # Commit the changes to the database
    db.session.commit()
    
    return jsonify(todo_to_update.to_dict())

# DELETE /api/todos/<id> - Delete a todo from the DB
@app.route('/api/todos/<string:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Deletes a todo item from the database."""
    todo_to_delete = Todo.query.get(todo_id)
    if not todo_to_delete:
        return jsonify({"error": "Todo not found"}), 404
        
    # Delete from the session and commit
    db.session.delete(todo_to_delete)
    db.session.commit()
    
    return '', 204

# 5. Main execution block
if __name__ == '__main__':
    with app.app_context():
        # This will create the database file and table if they don't exist
        db.create_all()
    app.run(debug=True, port=5000)