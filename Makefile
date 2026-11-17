.PHONY: version

version:
	@if [ -z "$(word 2,$(MAKECMDGOALS))" ]; then \
		echo "Usage: make version X.Y.Z"; \
		exit 1; \
	fi; \
	VERSION=$(word 2,$(MAKECMDGOALS)); \
	echo "Updating version to $$VERSION"; \
	for file in $$(find . -type f -name "*.info.yml"); do \
		echo "Updating $$file"; \
		sed -i -E "s/^version:.*/version: '$$VERSION'/" "$$file"; \
	done

# Prevent make from treating the version number as a target
%:
	@: