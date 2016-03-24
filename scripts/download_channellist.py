import json
import random

import util


def main():
    config = util.load_config()

    with util.get_ts3conn(config["teamspeak"]) as ts3conn:
        dbconn = util.get_dbconn(config["database"])

        channels = {}
        channel_ids = ["0"]

        # collect channels
        server_info = ts3conn.serverinfo().parsed[0]
        channels["0"] = {
            "_id": "0",
            "channel_name": server_info["virtualserver_name"],
            "channel_order": "0",
            "pid": None,
            "children": []
        }
        for c in ts3conn.channellist().parsed:
            channel_ids.append(c["cid"])
            channels[c["cid"]] = {
                "_id": c["cid"],
                "channel_name": c["channel_name"],
                "channel_order": c["channel_order"],
                "pid": c["pid"],
                "children": []
            }


        # add children to channels
        for cid in channel_ids:
            channel = channels[cid]
            if channel["pid"]:
                channels[channel["pid"]]["children"].append(cid)

        # sort children array
        for channel in channels.values():
            unsorted_list = channel["children"]
            sorted_list = []
            last_item = "0"
            while unsorted_list:
                for i in range(len(unsorted_list)):
                    if channels[unsorted_list[i]]["channel_order"] == last_item:
                        break
                last_item = unsorted_list.pop(i)
                sorted_list.append(last_item)
            channel["children"] = sorted_list

        # insert channels into database
        for channel in channels.values():
            util.mongodb_collection_replace_one_by_id(dbconn.channels, channel)


if __name__ == "__main__":
    main()
