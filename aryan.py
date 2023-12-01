import requests
from flask import Flask,redirect,request,jsonify,session
from datetime import datetime,timedelta
import urllib.parse
app=Flask(_name_)
app.secret_key = '85c485a0-231f-5521-e950-2d4385558952'
CLIENT_ID = 'c8f7899b69aa4f17a3ce3f0b60dd510b'
CLIENT_SECRET = 'b736f62eca7742e9b7f246c5b4839119'
REDIRECT_URI = 'http://localhost:5000/callback'
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

@app.route('/')
def index():
  return "Welcome to my app <a href='/login'>Login</a>"

@app.route('/login')
def login():
  scope = 'user-read-private user-read-email user-top-read'
  params = {
      'client_id':CLIENT_ID,
      'response_type':'code',
      'scope':scope,
      'redirect_uri':REDIRECT_URI,
      'show_dialog':True
  }
  auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
  return redirect(auth_url)

@app.route('/callback')
def callback():
  if 'error' in request.args:
    return jsonify({"error":request.args['error']})
  if 'code' in request.args:
    req_body={
        'code':request.args['code'],
        'grant_type':'authorization_code',
        'redirect_uri':REDIRECT_URI,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET
    } 
    response = requests.post(TOKEN_URL,data=req_body)
    token_info = response.json()
    session['access_token'] = token_info['access_token']
    session['refresh_token'] = token_info['refresh_token']
    session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
    return redirect('/tracks')

@app.route('/tracks')
def get_track_names():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  response = requests.get(API_BASE_URL + 'me/top/tracks?limit=100',headers = header)
  tracks = response.json()
  list_track_names=[]
  for track in tracks['items']:
    list_track_names.append(track['name'])
  global list_track_ids
  list_track_ids=[]
  for track in tracks['items']:
    list_track_ids.append(track['id'])
  #return(jsonify(list_track_names),jsonify(list_track_ids))
  return redirect('/stats')

@app.route('/stats')
def stats():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  all_stats={}
  all_stats['acousticness']=[]
  all_stats['danceability']=[]
  all_stats['energy']=[]
  all_stats['instrumentalness']=[]
  all_stats['liveness']=[]
  all_stats['loudness']=[]
  all_stats['speechiness']=[]
  all_stats['tempo']=[]
  all_stats['valence']=[]
  for i in range(0,len(list_track_ids)):
    response = requests.get(API_BASE_URL + 'audio-features/' + list_track_ids[i],headers = header)
    response_json = response.json()
    all_stats['acousticness'].append(response_json['acousticness'])
    all_stats['danceability'].append(response_json['danceability'])
    all_stats['energy'].append(response_json['energy'])
    all_stats['instrumentalness'].append(response_json['instrumentalness'])
    all_stats['liveness'].append(response_json['liveness'])
    all_stats['loudness'].append(response_json['loudness'])
    all_stats['speechiness'].append(response_json['speechiness'])
    all_stats['tempo'].append(response_json['tempo'])
    all_stats['valence'].append(response_json['valence'])
  all_stats_avg = {}
  all_stats_avg['acousticness']=round(sum(all_stats['acousticness'])/len(all_stats['acousticness']),4)
  all_stats_avg['danceability']=round(sum(all_stats['danceability'])/len(all_stats['danceability']),4)
  all_stats_avg['energy']=round(sum(all_stats['energy'])/len(all_stats['energy']),4)
  all_stats_avg['instrumentalness']=round(sum(all_stats['instrumentalness'])/len(all_stats['instrumentalness']),4)
  all_stats_avg['liveness']=round(sum(all_stats['liveness'])/len(all_stats['liveness']),4)
  all_stats_avg['loudness']=round(sum(all_stats['loudness'])/len(all_stats['loudness']),4)
  all_stats_avg['speechiness']=round(sum(all_stats['speechiness'])/len(all_stats['speechiness']),4)
  all_stats_avg['tempo']=round(sum(all_stats['tempo'])/len(all_stats['tempo']),4)
  all_stats_avg['valence']=round(sum(all_stats['valence'])/len(all_stats['valence']),4)
  return all_stats_avg

@app.route('/refresh-token')
def refresh_token():
  if 'refresh_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    req_body = {
        'grant_type':'refresh_token',
        'refresh_token':session['refresh_token'],
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL,data = req_body)
    new_token_info = response.json()
    session['access_token'] = new_token_info['access_token']
    session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']
    return redirect('/tracks')

if _name_ == '_main_':
  app.run(host = '0.0.0.0',debug=True)