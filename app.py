from flask import Flask,render_template, jsonify
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/pizza")
def get_pizza():
    return jsonify(members=[
        {"name": "moshi", "slices": 1, "toppings": ["Plain", "Olives"]},
    ])

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
