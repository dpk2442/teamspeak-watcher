import configparser
import os

import flask
import pymongo


app = flask.Flask(__name__)

_ini_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "config.ini")
config = configparser.ConfigParser()
config.read(_ini_file)

_db_host = config["database"]["host"]
try:
    _db_port = int(config["database"]["port"])
except ValueError:
    _db_port = None
_db_database = config["database"]["database"]
db = pymongo.MongoClient(_db_host, _db_port)[_db_database]


@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/channels")
def channels():
    channel_list = db.channels.find()
    channels = {}
    for channel in channel_list:
        channels[channel["_id"]] = channel
    return flask.jsonify(data=channels)


@app.route("/clients")
def clients():
    client_list = db.clients.find()
    clients = {}
    for client in client_list:
        clients[client["_id"]] = client
    return flask.jsonify(data=clients)


@app.route("/data")
def data():
    data_list = db.data.find()
    data = {}
    for entry in data_list:
        data[entry["_id"]] = entry
    return flask.jsonify(data=data)

@app.route("/data/current")
def data_current():
    results = db.data.find().sort("_id", pymongo.DESCENDING).limit(1)
    return flask.jsonify(timestamp=results[0]["_id"], data=results[0]["client_list"])


if __name__ == "__main__":
    app.run(debug=True)
