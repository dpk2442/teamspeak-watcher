import configparser
import contextlib
import os

import pymongo
import ts3


def load_config():
    ini_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "config.ini")
    config = configparser.ConfigParser()
    config.read(ini_file)
    return config


@contextlib.contextmanager
def get_ts3conn(ts3config):
    host = ts3config["host"]
    port = ts3config["port"]
    username = ts3config["username"]
    password = ts3config["password"]
    virtual_server = ts3config["virtual_server"]
    nickname = ts3config["nickname"] if "nickname" in ts3config else None

    with ts3.query.TS3Connection(host, port) as ts3conn:
        ts3conn.login(
                client_login_name=username,
                client_login_password=password
        )
        ts3conn.use(sid=virtual_server)
        if nickname:
            ts3conn.clientupdate(client_nickname=ts3config["nickname"])
        yield ts3conn


def get_dbconn(dbconfig):
    host = dbconfig["host"]
    try:
        port = int(dbconfig["port"])
    except ValueError:
        port = None
    database = dbconfig["database"]

    db = pymongo.MongoClient(host, port)
    return db[database]


def mongodb_collection_replace_one_by_id(collection, record):
    collection.replace_one({"_id": record["_id"]}, record, True)
