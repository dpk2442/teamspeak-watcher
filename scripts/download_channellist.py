import util


def main():
    config = util.load_config()

    with util.get_ts3conn(config["teamspeak"]) as ts3conn:
        dbconn = util.get_dbconn(config["database"])

        server_info = ts3conn.serverinfo().parsed[0]
        util.mongodb_collection_replace_one_by_id(dbconn.channels, {
            "_id": "0",
            "channel_name": server_info["virtualserver_name"],
            "channel_order": None,
            "pid": None
        })

        for c in ts3conn.channellist().parsed:
            util.mongodb_collection_replace_one_by_id(dbconn.channels, {
                "_id": c["cid"],
                "channel_name": c["channel_name"],
                "channel_order": c["channel_order"],
                "pid": c["pid"]
            })


if __name__ == "__main__":
    main()
