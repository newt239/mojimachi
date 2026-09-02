PROJECT := apple/Mojimachi.xcodeproj
SCHEME := Mojimachi
DERIVED_DATA := .build
APP := $(DERIVED_DATA)/Build/Products/Debug/mojimachi.app

.PHONY: generate build run format lint codecheck clean

generate:
	xcodegen generate --spec apple/project.yml --project apple

build: generate
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration Debug \
		-destination 'platform=macOS' -derivedDataPath $(DERIVED_DATA) \
		CODE_SIGNING_ALLOWED=NO build

run: build
	open $(APP)

format:
	xcrun swift-format format --in-place --recursive apple/Sources

lint:
	xcrun swift-format lint --strict --recursive apple/Sources

codecheck: lint build

clean:
	rm -rf $(DERIVED_DATA) apple/Mojimachi.xcodeproj
