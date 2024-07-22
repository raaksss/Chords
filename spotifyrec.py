import requests
from flask import Flask,redirect,request,jsonify,session
from datetime import datetime,timedelta
import urllib.parse
from pymongo import MongoClient
import math

app=Flask(__name__)
app.secret_key = '85c485a0-231f-5521-e950-2d4385558952'
CLIENT_ID = 'c8f7899b69aa4f17a3ce3f0b60dd510b'
CLIENT_SECRET = 'b736f62eca7742e9b7f246c5b4839119'
REDIRECT_URI = 'http://localhost:7000/callback'
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

client = MongoClient("mongodb://localhost:27017")
db = client['spo']
col1 = db['first']

def ed(dic1,dic2):
  dist=0
  score=0
  per=0
  for i in dic1:
    dist+=(dic1[i]-dic2[i])**2
  score=1/(1+math.sqrt(dist))
  per=score*100
  return per

def norm_l(dic):
  loudness = dic['loudness']
  new_loudness = (loudness + 60) / 60
  dic['loudness'] = new_loudness
  return dic

def norm_t(dic):
  tempo = dic['tempo']
  new_tempo = (tempo - 40) / 260
  dic['tempo'] = new_tempo
  return dic

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
    return redirect('/menu')

@app.route('/menu')
def menu():
    if 'access_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token')
    dname = personal()
    track_names = get_track_names()
    artist_names = get_artist_names()
    related()
    full_stats = stats()
    new_songs = rec()
    score = match()
    return f'<h2>Hi {dname}, ' \
               f'<a href="/rec">My Recommended Songs</a> | ' \
               f'<a href="/match">Match Score</a> | ' \
               f'<a href="/artists">My Top Artists</a> | ' \
               f'<a href="/tracks">My Top Songs</a> | ' \

@app.route('/tracks')
def get_track_names():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  response = requests.get(API_BASE_URL + 'me/top/tracks?limit=50',headers = header)
  tracks = response.json()
  global list_track_names
  list_track_names=[]
  for track in tracks['items']:
    list_track_names.append(track['name'])
  global list_track_ids
  list_track_ids=[]
  for track in tracks['items']:
    list_track_ids.append(track['id'])
  return list_track_names

@app.route('/artists')
def get_artist_names():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  response = requests.get(API_BASE_URL + 'me/top/artists?limit=50',headers = header)
  artists = response.json()
  global list_artist_names
  list_artist_names=[]
  for artist in artists['items']:
    list_artist_names.append(artist['name'])
  global list_artist_ids
  list_artist_ids=[]
  for artist in artists['items']:
    list_artist_ids.append(artist['id'])
  global list_genres
  list_genres=[]
  for artist in artists['items']:
    for genre in artist['genres']:
      if genre not in list_genres:
        list_genres.append(genre)
  return list_artist_names

@app.route('/related_artists')
def related():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  global list_related_artist_names
  list_related_artist_names=[]
  for i in range(0,5):
    response = requests.get(API_BASE_URL + 'artists/' + list_artist_ids[i] + '/related-artists',headers = header)
    rel = response.json()
    for i in range(0,3):
      if rel['artists'][i]['name'] not in list_artist_names:
        list_related_artist_names.append(rel['artists'][i]['name'])
        list_artist_names.append(rel['artists'][i]['name'])
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
  global all_stats
  global all_stats_avg
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
  col1.insert_one(all_stats_avg)
  return all_stats_avg

@app.route('/personal')
def personal():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  response = requests.get(API_BASE_URL + 'me',headers = header)
  details = response.json()
  global country
  global dname
  country = details['country']
  dname = details['display_name']
  return dname

@app.route('/rec')
def rec():
  if 'access_token' not in session:
    return redirect('/login')
  if datetime.now().timestamp() > session['expires_at']:
    return redirect('/refresh-token')

  header = {
      'Authorization':f"Bearer {session['access_token']}"
  }
  avail_genres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]
  genre_seed = []
  for i in list_genres:
    if i in avail_genres:
      genre_seed.append(i)
  global genre_seed_string
  genre_seed_string = ""
  count_genre = 0
  for i in genre_seed:
    genre_seed_string+=i
    count_genre +=1
    if count_genre!=2:
      genre_seed_string+='%2C'
    else:
      break
  ''' if len(genre_seed)<5:
    length = len(genre_seed)
    for i in genre_seed:
      genre_seed_string+=i
      length = length-1
      if length!=0:
        genre_seed_string+='%2C'
  else:
    for i in genre_seed[:5]:
      genre_seed_string+=i
      if i!=genre_seed[4]:
        genre_seed_string+='%2C' '''
  global artist_seed_string
  artist_seed_string = ""
  for i in list_artist_ids[:2]:
    artist_seed_string+=i
    if i!=list_artist_ids[1]:
        artist_seed_string+='%2C'
  global track_seed_string
  track_seed_string = ""
  for i in list_track_ids[:1]:
    track_seed_string+=i
    if i!=list_track_ids[0]:
        track_seed_string+='%2C'
  response = requests.get(API_BASE_URL + 'recommendations?market=' + country + '&seed_artists=' + artist_seed_string + '&seed_genres=' + genre_seed_string + '&seed_tracks=' + track_seed_string ,headers = header)
  rec = response.json()
  global recommended_songs
  recommended_songs = []
  for i in range(0,10):
    recommended_songs.append(rec['tracks'][i]['name'])
  return recommended_songs
  #return redirect('/match')

@app.route('/match')
def match():
  data = list(col1.find())
  dic1 = data[0]
  dic2 = data[1]
  del dic1['_id']
  del dic2['_id']
  dic1_l = norm_l(dic1)
  dic1_lt = norm_t(dic1_l)
  dic2_l = norm_l(dic2)
  dic2_lt = norm_t(dic2_l)
  res = ed(dic1_lt,dic2_lt)
  output = []
  output.append(res)
  return output

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

if __name__ == '__main__':
  app.run(host = '0.0.0.0',debug = True, port = 7000)