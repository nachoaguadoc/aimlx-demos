uwsgi --http 0.0.0.0:4343 --wsgi-file server.py --callable app --master -b 32768
