import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from models import user
import os
from datetime import datetime
from dateutil.parser import parse as parse_date

dynamodb = boto3.resource(
      "dynamodb", 
      region_name=os.getenv("AWS_REGION"),
      aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
      aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
      )
user_table = dynamodb.Table("User")
chat_table = dynamodb.Table("Chat")

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

def update_user_resumes(user_id: str, resume_url: str):
    try:
        user = get_user_by_id(user_id)
        if not user:
            print("No user found")
            return
        user_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET resumes = list_append(if_not_exists(resumes, :empty_list), :new_resume)",
            ExpressionAttributeValues={
                ":new_resume": [resume_url], 
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
        user_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET chats = list_append(if_not_exists(chats, :empty_list), :new_chat)",
            ExpressionAttributeValues={
                ":new_chat": [new_chat_id], 
                ":empty_list": [] 
            }
        )
        print("User updated successfully")
    except ClientError as e:
        print(e)

def get_user_chats(user_id: str):
    try:
        # print(user_id)
        response = chat_table.query(
            IndexName="userid-index",
            KeyConditionExpression=Key("userid").eq(str(user_id))
        ) 
        items = response.get("Items", [])
        # print(items)
        chats = [
            {
                "id": item.get("id"),
                "title": item.get("name"),
                "dateCreated": item.get("dateCreated"),  
                "lastUpdated": item.get("lastUpdated"),
                "thumbnail": item.get("thumbnail")
            }
            for item in items
        ]
        def parse_iso(date_str):
            try:
                return parse_date(date_str)
            except:
                return datetime.min

        chats.sort(key=lambda chat: parse_iso(chat.get("lastUpdated") or chat.get("dateCreated")), reverse=True)

        return chats
    except ClientError as e:
        print(e)
        return None

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
        
def get_chat_messages_by_id(id: str):
    try:
        response = chat_table.get_item(Key={"id":id})
        chat = response.get("Item")
        return chat["messages"]
    except ClientError as e:
        print(e)
        return None
        
def update_chat(chat_id: str, chat_data: dict):
    try:
        chat_table.put_item(Item=chat_data)
    except ClientError as e:
        print(f"Error updating chat: {e}")

def update_chat_messages(chat_id: str, chat_messages: dict):
    try:
        response = chat_table.update_item(
            Key={'id': chat_id},
            UpdateExpression="SET messages = :m",
            ExpressionAttributeValues={':m': chat_messages},
            ReturnValues="UPDATED_NEW"
        )
        print(response)
        return response
    except ClientError as e:
        print(f"Error updating chat messages: {e}")
        return None

def update_chat_summary(chat_id: str, chat_summary: str):
    try:
        response = chat_table.update_item(
            Key={"id": chat_id},
            UpdateExpression="SET #sum = :s",
            ExpressionAttributeNames={"#sum": "summary"},
            ExpressionAttributeValues={":s": chat_summary},
            ReturnValues="UPDATED_NEW",
        )
        return response["Attributes"]["summary"]
    except ClientError as e:
        print(f"Error updating chat summary: {e}")
        return None
    

def get_chat_summary(chat_id: str) -> str:
    try:
        resp = chat_table.get_item(
            Key={"id": chat_id}
        )
    except ClientError as e:
        print("error getting user", e)
        return None
    
    if "Item" not in resp:
        print("no chat found")
        return None
    
    item = resp["Item"]
    summary = item.get("summary")
    if summary is None:
        try:
            chat_table.update_item(
                Key={"id": chat_id},
                UpdateExpression="SET #s = :empty",
                ExpressionAttributeNames={"#s": "summary"},
                ExpressionAttributeValues={":empty": ""},
            )
        except ClientError as e:
            print("error initializing summary for chat", e)
            return None
        return ""
    print("summary", summary)
    return summary


def create_chat(data: dict):
    try:
       chat_table.put_item(Item=data)
    except ClientError as e:
        print(e)
        return None
        
     


# def create_chat()

        
