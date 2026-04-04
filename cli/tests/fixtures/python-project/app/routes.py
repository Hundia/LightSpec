from flask import Flask
app = Flask(__name__)

@app.route('/api/items', methods=['GET'])
def get_items():
    return []

@app.route('/api/items', methods=['POST'])
def create_item():
    return {}, 201
