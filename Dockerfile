FROM public.ecr.aws/lambda/python:3.13

WORKDIR ${LAMBDA_TASK_ROOT}

COPY pyproject.toml poetry.lock ${LAMBDA_TASK_ROOT}/

RUN pip install poetry==2.0.1

RUN poetry self add poetry-plugin-export

RUN poetry export --without-hashes -f requirements.txt --output requirements.txt && \
    pip install -r requirements.txt

COPY grocery_prices ${LAMBDA_TASK_ROOT}/grocery_prices
