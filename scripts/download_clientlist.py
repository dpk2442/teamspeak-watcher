import time

import util


def main():
    config = util.load_config()

    with util.get_ts3conn(config["teamspeak"]) as ts3conn:
        dbconn = util.get_dbconn(config["database"])

        client_list = []
        for client in ts3conn.clientlist(voice=True, away=True).parsed:
            if client["client_type"] == "0":
                client_list.append({
                    "client_database_id": client["client_database_id"],
                    "channel_id": client["cid"],
                    "client_input_muted": client["client_input_muted"],
                    "client_output_muted": client["client_output_muted"],
                    "client_away_status": client["client_away_status"],
                    "client_away_message": client["client_away_message"]
                })


        dbconn.data.insert_one({
            "_id": int(time.time()),
            "client_list": client_list
        })


if __name__ == "__main__":
    main()
