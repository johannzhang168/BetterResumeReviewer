import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)

def test_read_root(capfd):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "successfully initialized dynamo"}
    captured = capfd.readouterr()
    print("Captured Output:", captured.out)

