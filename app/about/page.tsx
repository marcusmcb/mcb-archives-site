import { AudioPlayerBar } from "../../components/player/AudioPlayerBar";

const AboutPage = () => {
  return (
    <div>
      <AudioPlayerBar />

      <div className="aboutWrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="aboutImage" src="/images/djmarcusmcb.png" alt="djmarcusmcb" />

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
            produced for over the years. There&apos;s a little bit of everything in here, and I&apos;ll be adding new content to
            the site regularly. As they say in broadcasting, &quot;stay tuned!&quot;
          </p>

          <p>
            Not sure where to start? Try one of the filters from the menu, or do a search by song or artist to see what
            pops up!
          </p>

          <p>Thanks for being here and for checking out my work. Always appreciated!</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
