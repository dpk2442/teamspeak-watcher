import datetime

import util

def main():
    config = util.load_config()
    dbconn = util.get_dbconn(config["database"])

    today = datetime.date.today()
    start_of_month_timestamp = datetime.datetime(
        today.year, today.month, 1, tzinfo=datetime.timezone.utc).timestamp()

    user_counts = [[] for i in range(48)]

    for data_point in dbconn.data.find({"_id": {"$gte": start_of_month_timestamp}}):
        timestamp = datetime.datetime.fromtimestamp(data_point["_id"], tz=datetime.timezone.utc)
        index = (timestamp.hour * 2) + (timestamp.minute // 30)
        user_counts[index].append(len(data_point["client_list"]))

    average_user_counts = [sum(l) / len(l) if l else 0 for l in user_counts]

    util.mongodb_collection_replace_one_by_id(dbconn.daily_usage, {
        "_id": "current",
        "average_user_counts": average_user_counts
    })


if __name__ == "__main__":
    main()
