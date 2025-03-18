import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from models import user
import os

dynamodb = boto3.resource(
      "dynamodb", 
      region_name=os.getenv("AWS_REGION"),
      aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
      aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
      )
user_table = dynamodb.Table("User")
chat_table = dynamodb.Table("Chats")

def get_user_by_email(email: str):
    try:
        response = user_table.query(
            IndexName="email-index",  
            KeyConditionExpression=Key("email").eq(email)
        )
        items = response.get("Items", [])
        return items[0] if items else None  
    except ClientError as e:
        print(f"Error fetching user: {e}")
        return None
        
def get_user_by_id(id: str):
        try:
            response = user_table.get_item(Key={"id": id})
            return response.get("Item")
        except ClientError as e:
            print(e)
            return None
        
def update_user_attributes(user_id: str, data: dict):
    try:
        print(user_id)
        user = get_user_by_id(user_id)
        if not user:
            print("No user found")
            return None
        update_expression = "SET " + ", ".join(f"#{k} = :{k}" for k in data.keys())
        expression_attribute_values = {f":{k}": v for k, v in data.items()}
        expression_attribute_names = {f"#{k}": k for k in data.keys()} 

        user_table.update_item(
            Key={"id": user_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names,
            ReturnValues="UPDATED_NEW",
        )
        updated_user = get_user_by_id(user_id)
        
        return updated_user
    
    except ClientError as e:
        print("Error", e)
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

        
