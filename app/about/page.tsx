import { AudioPlayerBar } from "../../components/player/AudioPlayerBar";

const AboutPage = () => {
  const timelineItems = [
    { title: "KPTY", detail: "Phoenix (1998)" },
    { title: "Beat Radio", detail: "Nationwide (1998)" },
    { title: "Superadio Networks", detail: "(1998 - 2007, 2022 - 2024)" },
    { title: "KEDJ", detail: "Phoenix (1999 - 2002)" },
    { title: "KFNK", detail: "Seattle (1999 - 2002)" },
    { title: "BPM", detail: "XM Satellite Radio (2004 - 2008)" },
    { title: "KAJM", detail: "Phoenix (2005 - 2008)" },
    { title: "KNRJ", detail: "Phoenix (2005 - 2008)" },
    { title: "JamTraxx Media", detail: "(2010 - 2022)" },
    { title: "ClubJam", detail: "iHeartRadio (2014 - 2022)" }
  ];

  return (
    <div>
      <AudioPlayerBar />

      <div className="aboutPageGrid">
        <div className="aboutWrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="aboutImage"
            src="https://pub-7364f58a4f4e4cd489b1dc00ae789eb7.r2.dev/images/djmarcusmcb.png"
            alt="djmarcusmcb"
          />

          <h1 className="aboutHeader">Welcome to the Archive!</h1>

          <div className="aboutText">
            <p>
              From 1998 to 2022, I had the priviledge and pleasure as a DJ to rock the airwaves every weekend on radio
              stations all across the country.
            </p>

            <p>
              Over those years, I had the good fortune to work with some of the best in the business - from broadcast
              syndication with Superadio to the early days at XM Satellite Radio and later programming multiple ClubJam
              channels for the iHeartRadio app.
            </p>

            <p>And it&apos;s all been sitting on discs and drives until now.</p>

            <p>
              Here in the archives, you&apos;ll find late night mixshows from all the past stations and platforms that I&apos;ve
              produced for over the years. There&apos;s a little bit of everything in here, and I&apos;ll be adding new content
              to the site regularly. As they say in broadcasting, &quot;stay tuned!&quot;
            </p>

            <p>
              Not sure where to start? Try one of the filters from the menu, or do a search by song or artist to see
              what pops up!
            </p>

            <p>Thanks for being here and for checking out my work. Always appreciated!</p>
          </div>
        </div>

        <aside className="aboutTimeline" aria-label="Stations and channels timeline">
          <div className="aboutSocialRow" aria-label="Social links">
            <a
              className="aboutSocialLink"
              href="https://www.youtube.com/@marcusmcb/videos"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12s0-3.9-.5-5.8ZM9.7 15.6V8.4L16 12l-6.3 3.6Z"
                />
              </svg>
            </a>

            <a
              className="aboutSocialLink"
              href="https://www.twitch.tv/djmarcusmcb"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitch"
              title="Twitch"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M4 2h18v12l-5 5h-4l-3 3H7v-3H3V6l1-4Zm2 2L5 6v11h4v3l3-3h5l3-3V4H6Zm10 8V7h2v5h-2Zm-5 0V7h2v5h-2Z"
                />
              </svg>
            </a>

            <a
              className="aboutSocialLink"
              href="https://bsky.app/profile/djmarcusmcb.bsky.social"
              target="_blank"
              rel="noreferrer"
              aria-label="Bluesky"
              title="Bluesky"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 11.4c-.7-1.3-2.7-4.1-4.6-5.4C5.6 4.8 4.8 4.7 4.3 5c-.5.3-.3 1.7-.3 2.1 0 .4.2 3.3.4 3.8.7 2.2 3.1 2.9 5.2 2.7-3 .5-5.7 1.8-3.6 5.2 2.3 3.7 6.2.8 7.7-1.8 1.5 2.6 3.2 5.6 7.7 1.8 2.1-3.4-.6-4.7-3.6-5.2 2.1.2 4.5-.5 5.2-2.7.2-.5.4-3.4.4-3.8 0-.4.2-1.8-.3-2.1-.5-.3-1.3-.2-3.1 1-1.9 1.3-3.9 4.1-4.6 5.4Z"
                />
              </svg>
            </a>

            <a
              className="aboutSocialLink"
              href="https://www.threads.com/@djmarcusmcb"
              target="_blank"
              rel="noreferrer"
              aria-label="Threads"
              title="Threads"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  d="M15.5 12v1.2c0 1.6-1.3 2.8-2.9 2.8h-.2c-2.2 0-3.9-1.7-3.9-3.9 0-2.4 1.8-4.1 4.2-4.1 2.2 0 3.7 1.3 3.7 3.4V12c0 1.1.7 1.8 1.7 1.8 1.6 0 2.7-1.6 2.7-3.7 0-4.1-3.3-7.1-8-7.1-5 0-9 4-9 9s4 9 9 9c3 0 5.3-1 7-2.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              className="aboutSocialLink"
              href="https://www.tiktok.com/@djmarcusmcb"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              title="TikTok"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M16.6 2c.6 3.4 2.7 5.5 6 5.9v3.3c-2.1.1-4-.6-6-1.8v6.7c0 4.3-2.9 7.4-7.2 7.4-3.7 0-6.6-2.8-6.8-6.4-.2-3.8 2.7-6.9 6.6-7.1.5 0 1 .1 1.5.2v3.6c-.5-.2-1-.3-1.5-.3-1.8.1-3.2 1.6-3.1 3.4.1 1.7 1.5 3 3.3 3 2 0 3.5-1.6 3.5-3.9V2h3.7Z"
                />
              </svg>
            </a>
          </div>

          <div className="aboutTimelineHeader">Stations &amp; Channels</div>
          <ul className="aboutTimelineList">
            {timelineItems.map((item) => (
              <li key={`${item.title} ${item.detail}`.trim()}>
                <a
                  className="aboutTimelineLink"
                  href={`https://www.google.com/search?q=${encodeURIComponent(`${item.title} ${item.detail}`.trim())}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="aboutTimelineTitle">{item.title}</div>
                  <div className="aboutTimelineDetail">{item.detail}</div>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AboutPage;
