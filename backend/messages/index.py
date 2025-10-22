'''
Business: API для сообщений в чатах локаций - создание и получение сообщений
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными сообщений в JSON
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
            location_id = query_params.get('location_id')
            
            if not location_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'location_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                SELECT m.*, 
                       c.name as character_name,
                       c.avatar as character_avatar
                FROM messages m
                JOIN characters c ON m.character_id = c.id
                WHERE m.location_id = %s
                ORDER BY m.created_at ASC
            ''', (location_id,))
            
            messages = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(msg) for msg in messages], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            character_id = body_data.get('character_id')
            location_id = body_data.get('location_id')
            content = body_data.get('content')
            
            if not all([character_id, location_id, content]):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''INSERT INTO messages (character_id, location_id, content) 
                   VALUES (%s, %s, %s) RETURNING *''',
                (character_id, location_id, content)
            )
            new_message = cur.fetchone()
            
            cur.execute('''
                SELECT c.name as character_name, c.avatar as character_avatar
                FROM characters c WHERE c.id = %s
            ''', (character_id,))
            character_data = cur.fetchone()
            
            conn.commit()
            cur.close()
            conn.close()
            
            result = dict(new_message)
            result.update(dict(character_data))
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(result, default=str),
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
