# TeamSpeak Watcher

Periodically scrapes data from a TeamSpeak server about who is connected, and
displays the information in a web interface.

## Installation

1. Clone the repository.
2. Create a configuration file.
3. Create the virtual environment.
4. Install the scripts into cron. The following example would download the
   channels and client database once per day, and the current client list
   every five minutes.
        0   2 * * * /path/to/repo/bin/run_cronjob.sh download_channellist
        30  2 * * * /path/to/repo/bin/run_cronjob.sh download_clientdblist
        */5 * * * * /path/to/repo/bin/run_cronjob.sh download_clientlist
