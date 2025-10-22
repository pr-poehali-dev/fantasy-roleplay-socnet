'''
Business: API для управления персонажами - создание, получение списка, получение по ID
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными персонажей в JSON
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('user_id')
            character_id = query_params.get('id')
            
            if character_id:
                cur.execute(
                    'SELECT * FROM characters WHERE id = %s',
                    (character_id,)
                )
                character = cur.fetchone()
                cur.close()
                conn.close()
                
                if character:
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(dict(character)),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Character not found'}),
                        'isBase64Encoded': False
                    }
            
            if user_id:
                cur.execute(
                    'SELECT * FROM characters WHERE user_id = %s ORDER BY created_at DESC',
                    (user_id,)
                )
            else:
                cur.execute('SELECT * FROM characters ORDER BY created_at DESC')
            
            characters = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(char) for char in characters], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            name = body_data.get('name')
            avatar = body_data.get('avatar', f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}")
            race = body_data.get('race')
            char_class = body_data.get('class')
            description = body_data.get('description')
            
            if not all([user_id, name, race, char_class, description]):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''INSERT INTO characters (user_id, name, avatar, race, class, description) 
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING *''',
                (user_id, name, avatar, race, char_class, description)
            )
            new_character = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_character), default=str),
                'isBase64Encoded': False
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
