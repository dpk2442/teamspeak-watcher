#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: run_cronjob.sh script"
    exit 1
fi

root="$(dirname "$(dirname "$0")")"

source "$root/venv/bin/activate"
python "$root/scripts/$1.py"
