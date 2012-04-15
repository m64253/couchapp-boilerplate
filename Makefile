APP = app-name
LOCAL = http://username:password@127.0.0.1:5984/name-of-database
REMOTE = https://username:password@hostname.iriscouch.com/name-of-database

push-local:
	./node_modules/couchapp/bin.js push $(APP) $(LOCAL)

push-remote:
	./node_modules/couchapp/bin.js push $(APP) $(REMOTE)

.PHONY: push-local push-remote