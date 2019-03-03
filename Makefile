account_id := $(shell aws sts get-caller-identity |  jq -r .Account)

lambdas := send status

build : $(foreach lambda,$(lambdas),build-$(lambda))
test : $(foreach lambda,$(lambdas),test-$(lambda))
terratest : terratest-apigw $(foreach lambda,$(lambdas),terratest-$(lambda))

build-% :
	$(MAKE) -C lambda/$* build

test-% :
	$(MAKE) -C lambda/$* test

terratest-% :
	$(MAKE) -C lambda/$* terratest

terratest-apigw :
	$(MAKE) -C deploy/test/apigw_setup

deploy-% : build
	$(MAKE) -C deploy/$*-$(account_id)

destroy-% :
	$(MAKE) -C deploy/$*-$(account_id) destroy
