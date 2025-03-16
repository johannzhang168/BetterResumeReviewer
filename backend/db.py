import boto3
from botocore.exceptions import ClientError
from models import user
import os

dynamodb = boto3.resource("dynamodb", region_name=os.getenv("AWS_REGION"))
user_table = dynamodb.Table("Users")
chat_table = dynamodb.Table("Chats")

def get_user_by_email(email: str):
        try:
                response = user_table.get_item(Key={"email": email})
                return response.get("Item")
        except ClientError as e:
                print(e)
                return None
        
def get_user_by_id(id: str):
        try:
                response = user_table.get_item(Key={"id": id})
                return response.get("Item")
        except ClientError as e:
                print(e)
                return None

def update_user_resumes(user_id: str, chat_id: str):
    try:
        user = get_user_by_id(user_id)
        if not user:
            print("No user found")
            return
        chat = get_chat_by_id(chat_id)
        if not chat:
            print("No chat found")
            return
        if not chat["resumes"]:
            print("No resumes found in chat")
            return
        new_resume = chat["resumes"][-1] 
        user_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET resumes = list_append(if_not_exists(resumes, :empty_list), :new_resume)",
            ExpressionAttributeValues={
                ":new_resume": [new_resume], 
                ":empty_list": [] 
            }
        )
        print("User updated successfully")
    except ClientError as e:
        print(f"Error updating user: {e}")

def update_user_chats(user_id: str, new_chat_id: str):
    try:
        user = get_user_by_id(user_id)
        if not user:
                print("No user found")
                return
        chat = get_chat_by_id(new_chat_id)
        if not chat:
                print("No chat found")
                return
        update_user_resumes(user_id, new_chat_id)
        user_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET chats = list_append(if_not_exists(chats, :empty_list), :chat)",
            ExpressionAttributeValues={
                ":new_resume": [chat], 
                ":empty_list": [] 
            }
        )
        print("User updated successfully")
    except ClientError as e:
          print(e)

def create_user(data: dict):
        try:
                user_table.put_item(Item=data)
                return data
        except ClientError as e:
                print(e)
                return None
        
def get_chat_by_id(id: str):
        try:
                response = chat_table.get_item(Key={"id":id})
                return response.get("Item")
        except ClientError as e:
                print(e)
                return None
        
def update_chat(chat_id: str, chat_data: dict):
    try:
        chat_table.put_item(Item=chat_data)
    except ClientError as e:
        print(f"Error updating chat: {e}")

# def create_chat()

        
