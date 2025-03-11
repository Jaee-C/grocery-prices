#!/bin/bash

poetry build-lambda
cd infra || exit
tflocal apply -auto-approve -var-file=local.tfvars
