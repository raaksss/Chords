import React from 'react'
import '../styles/user.css';
const User = () => {
  return (
    <React.Fragment>
        <Main>
          <Header>
            <Avatar>
              {user.images.length > 0 ? (
                <img src={user.images[0].url} alt="avatar" />
              ) : (
                <NoAvatar>
                  <IconUser />
                </NoAvatar>
              )}
            </Avatar>
            <UserName href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <Name>{user.display_name}</Name>
            </UserName>
            <Stats>
              <Stat>
                <Number>{user.followers.total}</Number>
                <NumLabel>Followers</NumLabel>
              </Stat>
              {followedArtists && (
                <Stat>
                  <Number>{followedArtists.artists.items.length}</Number>
                  <NumLabel>Following</NumLabel>
                </Stat>
              )}
              {totalPlaylists && (
                <Stat>
                  <Link to="playlists">
                    <Number>{totalPlaylists}</Number>
                    <NumLabel>Playlists</NumLabel>
                  </Link>
                </Stat>
              )}
            </Stats>
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </Header>

          <Preview>
            <Tracklist>
              <TracklistHeading>
                <h3>Top Artists of All Time</h3>
              </TracklistHeading>
              <div>
                  <ul>
                    {topArtists.items.slice(0, 10).map((artist, i) => (
                      <Artist key={i}>
                        <ArtistArtwork to={`/artist/${artist.id}`}>
                          {artist.images.length && <img src={artist.images[2].url} alt="Artist" />}
                          <Mask>
                            <IconInfo />
                          </Mask>
                        </ArtistArtwork>
                        <ArtistName to={`/artist/${artist.id}`}>
                          <span>{artist.name}</span>
                        </ArtistName>
                      </Artist>
                    ))}
                  </ul>
              </div>
            </Tracklist>
            <Tracklist>
              <TracklistHeading>
                <h3>Top Tracks of All Time</h3>
              </TracklistHeading>
              <ul>
                {
                  topTracks.items.slice(0, 10).map((track, i) => <TrackItem track={track} key={i} />)
                }
              </ul>
            </Tracklist>
          </Preview>
        </Main>
    </React.Fragment>
  )
}

export default User
