from flask import Flask, render_template, request, jsonify
import json
import os
import requests

app = Flask(__name__)

# ✅ FIXED PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "opportunities.json")
EXAM_FILE = os.path.join(BASE_DIR, "exam.json")
RESOURCE_FILE = os.path.join(BASE_DIR, "resources.json")

# Create file if not exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(EXAM_FILE):
    with open(EXAM_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(RESOURCE_FILE):
    with open(RESOURCE_FILE, "w") as f:
        json.dump([], f)

def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

def load_exams():
    try:
        with open(EXAM_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def load_resources():
    try:
        with open(RESOURCE_FILE, "r") as f:
            return json.load(f)
    except:
        return []
# =========================
# Pages
# =========================

# FIRST PAGE
@app.route("/")
def home():
    return render_template("index.html")

# SECOND PAGE
@app.route("/yard")
def yard():
    return render_template("yard.html")

@app.route("/exam")
def exam():
    try:
        r = requests.get("http://localhost:8080/exam/all", timeout=3)
        if r.status_code == 200:
            exams_raw = r.json()
            exams = []
            for ex in exams_raw:
                exams.append({
                    "name": ex.get("name", ""),
                    "description": ex.get("description", ""),
                    "eligibility": ex.get("eligibility", ""),
                    "mode": ex.get("mode", ""),
                    "level": ex.get("level", ""),
                    "application_date": ex.get("applicationDate", ""),
                    "official_link": ex.get("officialLink", "")
                })
        else:
            exams = load_exams()
    except Exception as e:
        print("Failed to load exams from backend, falling back to local JSON file:", e)
        exams = load_exams()

    return render_template(
        "exam.html",
        exams=exams
    )
# THIRD PAGE
@app.route("/user")
def user():
    return render_template("user.html")

@app.route("/resources")
def resources():
    return render_template("resources.html")

# ADMIN PAGE
@app.route("/admin")
def admin():
    return render_template("opportunity.html")

# =========================
# APIs
# =========================
@app.route("/api/resources")
def get_resources():
    return jsonify(load_resources())    

@app.route("/api/opportunities", methods=["GET"])
def get_opportunities():
    return jsonify(load_data())

@app.route("/api/opportunities", methods=["POST"])
def add_opportunity():
    new_data = request.get_json()

    if not new_data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["title", "category", "link", "description"]

    for field in required_fields:
        if field not in new_data or not new_data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    data = load_data()
    data.append(new_data)
    save_data(data)

    print("✅ Data saved:", new_data)

    return jsonify({"message": "Added successfully"}), 201

@app.route("/api/opportunities/<int:index>", methods=["PUT"])
def update_opportunity(index):
    data = load_data()
    updated_data = request.get_json()

    if not updated_data:
        return jsonify({"error": "No data provided"}), 400

    if 0 <= index < len(data):
        data[index] = updated_data
        save_data(data)
        return jsonify({"message": "Updated successfully"})
    else:
        return jsonify({"error": "Invalid index"}), 404

@app.route("/api/opportunities/<int:index>", methods=["DELETE"])
def delete_opportunity(index):
    data = load_data()

    if 0 <= index < len(data):
        data.pop(index)
        save_data(data)
        return jsonify({"message": "Deleted successfully"})
    else:
        return jsonify({"error": "Invalid index"}), 404

if __name__ == "__main__":
    app.run(debug=True)