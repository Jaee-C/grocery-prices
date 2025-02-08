from collections import abc

from pydantic import BaseModel


def to_lambda_response(data: abc.Sequence[BaseModel] | BaseModel) -> dict | list:
    """Convert pydantic models to a format suitable for a lambda response."""
    if isinstance(data, abc.Sequence):
        return [item.model_dump() for item in data]
    return data.model_dump()
