from flask import Flask, render_template, jsonify, request
import json
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/pizza", methods=["POST", "GET"])
def get_pizza():
    members = json.loads(request.args.get("members"))
    print members
    return jsonify(response=members)
    return jsonify(members=[
        {"name": "Moshi", "slices": 1, "toppings": ["Mushrooms", "Olives"]},
        {"name": "Liat", "slices": 1, "toppings": ["Eggplant", "Olives"]},
        {"name": "Ofir", "slices": 3, "toppings": ["Mushrooms"]},
        {"name": "Thrall", "slices": 7, "toppings": ["Eggplant", "Mushrooms"]},
    ])

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
