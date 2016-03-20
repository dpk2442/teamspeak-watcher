import util


def main():
    config = util.load_config()

    with util.get_ts3conn(config["teamspeak"]) as ts3conn:
        dbconn = util.get_dbconn(config["database"])

        count = ts3conn.clientdblist(count=True).parsed[0]["count"]
        for client in ts3conn.clientdblist(duration=count).parsed:
            client["_id"] = client["cldbid"]
            util.mongodb_collection_replace_one_by_id(dbconn.clients, client)


if __name__ == "__main__":
    main()
