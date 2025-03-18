from fastapi import APIRouter, Request, HTTPException, Depends
from db import update_user_attributes

router = APIRouter()

@router.put("/user/{userId}")
async def update_user(userId: str, request: Request):
  try:
    data = await request.json() 
    print("userid", userId)
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")
    updated_user = update_user_attributes(userId, data)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully", "user": updated_user}

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
