.DEFAULT_GOAL := all

SHELL := /bin/bash

.PHONY: all
all: ## show targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## install gems
	@bundle install --path vendor/bundle

.PHONY: serve
serve: ## serve with Jekyll
	@bundle exec jekyll serve --drafts --watch
