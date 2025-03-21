from fastapi import APIRouter, Request, HTTPException, Depends
from db import update_user_attributes
from middleware.get_current_user import get_current_user

router = APIRouter()

@router.put("/user/{userId}")
async def update_user(userId: str, request: Request):
  try:
    data = await request.json() 
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")
    updated_user = update_user_attributes(userId, data)
    updated_user = {
      "id": updated_user["id"],
      "chats": updated_user["chats"],
      "email": updated_user["email"],
      "firstName": updated_user["firstName"],
      "lastName": updated_user["lastName"],
      "graduationYear": updated_user["graduationYear"],
      "resumes": updated_user["resumes"]
    }
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully", "user": updated_user}

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
  

@router.get("/current-user")
async def get_current_user(user: dict = Depends(get_current_user)):
  return {"user": user}
