'''
Business: Регистрация и авторизация пользователей
Args: event с httpMethod, body; context с request_id
Returns: HTTP response с токеном сессии или данными пользователя
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
import hashlib
import secrets

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
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
            session_token = event.get('headers', {}).get('X-Session-Token') or event.get('headers', {}).get('x-session-token')
            
            if not session_token:
                cur.close()
                conn.close()
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'No session token provided'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'SELECT id, username, email FROM users WHERE session_token = %s',
                (session_token,)
            )
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if user:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(dict(user)),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid session'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                username = body_data.get('username')
                email = body_data.get('email')
                password = body_data.get('password')
                
                if not all([username, email, password]):
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('SELECT id FROM users WHERE username = %s OR email = %s', (username, email))
                existing = cur.fetchone()
                
                if existing:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Username or email already exists'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                session_token = generate_session_token()
                
                cur.execute(
                    '''INSERT INTO users (username, email, password_hash, session_token, last_login) 
                       VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP) RETURNING id, username, email, session_token''',
                    (username, email, password_hash, session_token)
                )
                new_user = cur.fetchone()
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps(dict(new_user)),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                username = body_data.get('username')
                password = body_data.get('password')
                
                if not all([username, password]):
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Missing username or password'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    'SELECT id, username, email FROM users WHERE username = %s AND password_hash = %s',
                    (username, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                session_token = generate_session_token()
                
                cur.execute(
                    'UPDATE users SET session_token = %s, last_login = CURRENT_TIMESTAMP WHERE id = %s',
                    (session_token, user['id'])
                )
                conn.commit()
                cur.close()
                conn.close()
                
                result = dict(user)
                result['session_token'] = session_token
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            
            else:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid action'}),
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
