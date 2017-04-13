export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

uwsgi --close-on-exec2 --http 0.0.0.0:4343 --wsgi-file server.py --callable app --master -b 32768 --close-on-exec
