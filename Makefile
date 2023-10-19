.PHONY: build-LibShared build-lambda-common
.PHONY: build-GetPizzaFunction build-GetAllPizzaFunction build-PutPizzaFunction build-DeletePizzaFunction

build-GetPizzaFunction:
	$(MAKE) HANDLER=src/pizzaService/get-pizza.ts build-lambda-common
build-GetAllPizzasFunction:
	$(MAKE) HANDLER=src/pizzaService/get-all-pizzas.ts build-lambda-common
build-PutPizzaFunction:
	$(MAKE) HANDLER=src/pizzaService/put-pizza.ts build-lambda-common
build-DeletePizzaFunction:
	$(MAKE) HANDLER=src/pizzaService/delete-pizza.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-LibShared:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes doesn't relate to dependencies
	