from flask import Flask, render_template, jsonify, request
from pizza_generator import generate
import json
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/pizza", methods=["POST", "GET"])
def get_pizza():
    data = json.loads(request.data)
    print data["members"]
    members = data["members"]
    clean_members = []
    for member in members:
        member_toppings = []
        for topping in member["toppings"]:
            member_toppings.append(topping["name"])
        clean_members.append([member["name"], int(member["slices"]), member_toppings])
    order = generate(clean_members)
    print order
    return jsonify(response=order)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
