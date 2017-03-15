
dist:
	rm -rf dist && mkdir dist && \
	./node_modules/.bin/babel lib --out-dir dist

.PHONY: test build dist start
