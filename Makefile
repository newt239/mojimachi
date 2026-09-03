PROJECT := apple/Mojimachi.xcodeproj
SCHEME := Mojimachi
DERIVED_DATA := .build
APP := $(DERIVED_DATA)/Build/Products/Debug/mojimachi.app

.PHONY: generate build run test format lint codecheck clean

generate:
	xcodegen generate --spec apple/project.yml --project apple

build: generate
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration Debug \
		-destination 'platform=macOS' -derivedDataPath $(DERIVED_DATA) \
		CODE_SIGNING_ALLOWED=NO build

run: build
	open $(APP)

test: generate
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration Debug \
		-destination 'platform=macOS' -derivedDataPath $(DERIVED_DATA) test

format:
	xcrun swift-format format --in-place --recursive apple

lint:
	xcrun swift-format lint --strict --recursive apple

codecheck: lint build test

clean:
	rm -rf $(DERIVED_DATA) apple/Mojimachi.xcodeproj
