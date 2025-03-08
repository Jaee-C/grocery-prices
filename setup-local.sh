#!/bin/bash

poetry build-lambda
localstack start -d
cd infra || exit
tflocal apply -auto-approve -var-file=local.tfvars
