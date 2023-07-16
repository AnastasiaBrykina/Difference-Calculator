install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
gendiff -h:
	node bin/gendiff.js
test:
	npx jest --watch
test-coverage:
	npx jest --coverage

.PHONY: test
