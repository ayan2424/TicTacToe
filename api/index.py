from flask import Flask, jsonify, request

app = Flask(__name__)

# Initialize high scores
high_scores = {
    "easy": 0,
    "medium": 0,
    "hard": 0
}

@app.route("/")
def home():
    return "Tic Tac Toe Backend is running!"

# Endpoint to get high scores
@app.route("/api/high-scores", methods=["GET"])
def get_high_scores():
    return jsonify(high_scores)

# Endpoint to update high scores
@app.route("/api/high-scores", methods=["POST"])
def update_high_scores():
    data = request.json
    difficulty = data.get("difficulty")
    level = data.get("level")

    if difficulty in high_scores:
        if level > high_scores[difficulty]:
            high_scores[difficulty] = level
            return jsonify({"message": "High score updated!", "high_scores": high_scores}), 200
        else:
            return jsonify({"message": "Level is not higher than the current high score."}), 400
    else:
        return jsonify({"message": "Invalid difficulty level."}), 400

if __name__ == "__main__":
    app.run(debug=True)
